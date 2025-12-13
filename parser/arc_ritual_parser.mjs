// parser/arc_ritual_parser.mjs
// -----------------------------------------------------------
// ARC RITUAL PARSER — versión extendida para pipelines audiovisuales
// Soporta rangos avanzados, bloques minimalistas e inline flexible.
// -----------------------------------------------------------

function cleanLine(l) {
  return l.replace(/\t/g, ' ').trim();
}

function parseKVFromLine(line) {
  const mEq = line.match(/^([\w._-]+)\s*=\s*(.+)$/);
  const mCol = line.match(/^([\w._-]+)\s*:\s*(.+)$/);
  const m = mEq || mCol;
  if (!m) return null;

  let key = m[1];
  let val = m[2].trim();

  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }

  return { key, val };
}

// -----------------------------------------------------------
// Rango avanzado (soporta s, f, flechas, guiones tipográficos, +frames)
// -----------------------------------------------------------

function parseRange(rangeStr) {
  const cleaned = rangeStr
    .replace(/→/g, "-")
    .replace(/->/g, "-")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .trim();

  // Ejemplos soportados:
  // 0-3s
  // 0s-3s
  // 3s+12f-5s
  // 0-120f
  // 0-3
  const rx = /^([\d\.]+)(s|f)?(?:\+([\d\.]+)f)?-([\d\.]+)(s|f)?$/;
  const m = cleaned.match(rx);

  if (!m) return { start: null, end: null };

  let s = Number(m[1]);
  let e = Number(m[4]);

  if (m[2] === "f") s = s / 24;
  if (m[5] === "f") e = e / 24;

  if (m[3]) s += Number(m[3]) / 24;

  return { start: s, end: e };
}

// -----------------------------------------------------------
// Bloques { ... }
// -----------------------------------------------------------

function parseBlock(lines, startIdx) {
  const out = [];
  let i = startIdx;

  for (; i < lines.length; i++) {
    const l = cleanLine(lines[i]);
    if (l === '}') { i++; break; }
    if (l.length) out.push(l);
  }
  return { block: out, nextIdx: i };
}

// -----------------------------------------------------------
// SEGMENT LINES
// -----------------------------------------------------------

function parseSegmentLines(rangeStr, linesOrBlock) {
  const { start, end } = parseRange(rangeStr);

  const seg = { start, end, rawRange: rangeStr, props: {} };
  const lines = Array.isArray(linesOrBlock) ? linesOrBlock : [String(linesOrBlock)];

  for (const raw of lines) {
    const line = cleanLine(raw);

    // 1. key = value / key: value
    const kv = parseKVFromLine(line);
    if (kv) {
      const key = kv.key;
      let val = kv.val;

      if (/^\d+(\.\d+)?$/.test(val)) val = Number(val);
      if (val === "true") val = true;
      if (val === "false") val = false;

      seg.props[key] = val;
      continue;
    }

    // 2. @fx bloom
    const tag = line.match(/^@([a-zA-Z_]+)\s+(.+)$/);
    if (tag) {
      const k = tag[1];
      let v = tag[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      seg.props[`@${k}`] = v;
      continue;
    }

    // 3. simple: img img1
    const mSimple = line.match(/^([a-zA-Z_]+)\s+(.+)$/);
    if (mSimple) {
      const key = mSimple[1];
      let val = mSimple[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1);
      seg.props[key] = val;
      continue;
    }
  }

  return seg;
}

// -----------------------------------------------------------
// TIMELINE BLOCK (modo flexible + extendido)
// -----------------------------------------------------------

function parseTimelineBlock(lines) {
  const segments = [];
  let i = 0;

  while (i < lines.length) {
    const l = cleanLine(lines[i]);

    // 1. segment 0-3s {
    const mSeg = l.match(/^segment\s+(.+?)\s*\{\s*$/i);
    if (mSeg) {
      const { block, nextIdx } = parseBlock(lines, i + 1);
      segments.push(parseSegmentLines(mSeg[1], block));
      i = nextIdx;
      continue;
    }

    // 2. 0-3s {
    const mShort = l.match(/^(.+?)\s*\{\s*$/);
    if (mShort && /^[\d\.sf+\-→–—> ]+$/.test(mShort[1])) {
      const { block, nextIdx } = parseBlock(lines, i + 1);
      segments.push(parseSegmentLines(mShort[1], block));
      i = nextIdx;
      continue;
    }

    // 3. segment 0-3s inline
    const mInlineSegment = l.match(/^segment\s+(.+?)\s+(.+)$/i);
    if (mInlineSegment) {
      const range = mInlineSegment[1];
      const rest = mInlineSegment[2].split(/\s(?=[a-zA-Z_@]+[:=])/);
      segments.push(parseSegmentLines(range, rest));
      i++;
      continue;
    }

    // 4. inline: 0-3s img: img1 text: "..."
    const mInline = l.match(/^(.+?)\s+(.+)$/);
    if (mInline && /^[\d\.sf+\-→–—> ]+$/.test(mInline[1])) {
      const range = mInline[1];
      const rest = mInline[2].split(/\s(?=[a-zA-Z_@]+[:=])/);
      segments.push(parseSegmentLines(range, rest));
      i++;
      continue;
    }

    i++;
  }

  return segments;
}

// -----------------------------------------------------------
// PARSER PRINCIPAL
// -----------------------------------------------------------

export function parseArcRitual(text) {
  if (!text || typeof text !== "string") {
    return { ok: false, error: "No text provided" };
  }

  const rawLines = text.split(/\r?\n/);
  const lines = [];

  for (let r of rawLines) {
    r = r.replace(/\t/g, ' ').replace(/\r/g, '').trim();
    if (!r) continue;
    r = r.replace(/\s*\{\s*$/g, " {").replace(/^\{\s*/g, "{");
    lines.push(r);
  }

  const ast = {
    name: null,
    meta: {},
    assets: {},
    timeline: [],
    styles: {}
  };

  let idx = 0;

  while (idx < lines.length) {
    const line = cleanLine(lines[idx]);

    // REEL / RITUAL <name> {
    const mReel = line.match(/^ritual\s+([A-Za-z0-9_.-]+)\s*\{\s*$/i)
                 || line.match(/^reel\s+([A-Za-z0-9_.-]+)\s*\{\s*$/i);

    if (mReel) {
      ast.name = mReel[1];
      idx++;

      while (idx < lines.length) {
        const cur = cleanLine(lines[idx]);
        if (cur === "}") { idx++; break; }

        const mSec = cur.match(/^([A-Za-z_]+)\s*\{\s*$/i);
        if (mSec) {
          const secName = mSec[1].toLowerCase();
          const { block, nextIdx } = parseBlock(lines, idx + 1);

          if (secName === "meta") {
            for (const ln of block) {
              const kv = parseKVFromLine(ln);
              if (kv) ast.meta[kv.key] = kv.val;
            }
          }

          else if (secName === "assets") {
            for (const ln of block) {
              const kv = parseKVFromLine(ln);
              if (kv) ast.assets[kv.key] = kv.val;
              else {
                const m = ln.match(/^([\w._-]+)\s*:\s*(.+)$/);
                if (m) ast.assets[m[1]] = m[2].replace(/^["']|["']$/g, "");
              }
            }
          }

          else if (secName === "styles") {
            for (const ln of block) {
              const kv = parseKVFromLine(ln);
              if (kv) ast.styles[kv.key] = kv.val;
            }
          }

          else if (secName === "timeline") {
            const segs = parseTimelineBlock(block);
            ast.timeline = ast.timeline.concat(segs);
          }

          else {
            ast[secName] = block;
          }

          idx = nextIdx;
          continue;
        }

        const kvTop = parseKVFromLine(cur);
        if (kvTop) {
          ast.meta[kvTop.key] = kvTop.val;
          idx++;
          continue;
        }

        idx++;
      }

      continue;
    }

    idx++;
  }

  return { ok: true, ast };
}
