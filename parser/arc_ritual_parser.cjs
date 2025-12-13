const fs = require("fs");

function parseKV(line) {
    const m = line.match(/^([\w_-]+)\s*=\s*(.+)$/);
    if (!m) return null;

    let key = m[1];
    let val = m[2].trim();

    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
    }

    return { key, val };
}

function parseBlock(lines, startIdx) {
    const out = [];
    let i = startIdx;

    for (; i < lines.length; i++) {
        const t = lines[i].trim();
        if (t === "}") {
            i++;
            break;
        }
        if (t.length) out.push(t);
    }

    return { block: out, nextIdx: i };
}

function parsePhaseBlock(lines) {
    const steps = [];

    for (const l of lines) {
        const m = parseKV(l);
        if (m && m.key === "step") {
            steps.push(m.val);
        }
    }

    return steps;
}

function parseMetaBlock(lines) {
    const meta = {};
    for (const l of lines) {
        const kv = parseKV(l);
        if (kv) meta[kv.key] = kv.val;
    }
    return meta;
}

function parseRitual(filePath) {
    const text = fs.readFileSync(filePath, "utf8");
    const lines = text
        .split(/\r?\n/)
        .map(l => l.replace(/\t/g, " ").trim());

    const ast = {
        type: "ritual",
        name: null,
        description: null,
        phases: [],
        meta: {}
    };

    let idx = 0;

    while (idx < lines.length) {
        const l = lines[idx];

        if (l.startsWith("ritual ")) {
            const m = l.match(/^ritual\s+([A-Za-z0-9_.-]+)\s*\{/);
            if (m) {
                ast.name = m[1];
                idx++;

                while (idx < lines.length) {
                    const cur = lines[idx].trim();
                    if (cur === "}") {
                        idx++;
                        break;
                    }

                    const kv = parseKV(cur);
                    if (kv && kv.key === "description") {
                        ast.description = kv.val;
                        idx++;
                        continue;
                    }

                    const mPhase = cur.match(/^phase\s+([\w_-]+)\s*\{/);
                    if (mPhase) {
                        const phaseId = mPhase[1];
                        const { block, nextIdx } = parseBlock(lines, idx + 1);
                        ast.phases.push({
                            id: phaseId,
                            steps: parsePhaseBlock(block)
                        });
                        idx = nextIdx;
                        continue;
                    }

                    if (cur.startsWith("meta")) {
                        const { block, nextIdx } = parseBlock(lines, idx + 1);
                        ast.meta = Object.assign(ast.meta, parseMetaBlock(block));
                        idx = nextIdx;
                        continue;
                    }

                    idx++;
                }
            }
        }

        idx++;
    }

    return ast;
}

module.exports = { parseRitual };
