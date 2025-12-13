// parser/arc_kernel_parser.js
const fs = require("fs");
const path = require("path");

// ---------------------------------------------
// Helpers
// ---------------------------------------------

function parseBlockLines(lines, startIdx) {
    const out = [];
    let i = startIdx;

    for (; i < lines.length; i++) {
        const l = lines[i].trim();
        if (l === "}") {
            i++;
            break;
        }
        if (l.length) out.push(l);
    }
    return { block: out, nextIdx: i };
}

function parseKV(line) {
    // key = value  OR key: value OR key = "string"
    const mEq = line.match(/^([\w_-]+)\s*=\s*(.+)$/);
    const mCol = line.match(/^([\w_-]+)\s*:\s*(.+)$/);
    const m = mEq || mCol;
    if (!m) return null;

    let key = m[1];
    let val = m[2].trim();

    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    else if (val.startsWith("[") && val.endsWith("]")) {
        const inner = val
            .slice(1, -1)
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);
        val = inner.map(x => x.replace(/^["']|["']$/g, ""));
    } else if (val === "true" || val === "false") {
        val = val === "true";
    } else if (/^\d+(\.\d+)?$/.test(val)) {
        val = Number(val);
    }

    return { key, val };
}

function parseInvokeBlock(lines) {
    const inv = [];

    for (const l of lines) {
        const m = l.match(/^invoke\s+([^\s{]+)\s*\{(.*)\}$/);
        if (m) {
            const name = m[1];
            const body = m[2].trim();
            const descMatch = body.match(/description\s*=\s*["']([^"']+)["']/);
            const outputsMatch = body.match(/outputs\s*=\s*\[([^\]]+)\]/);

            inv.push({
                name,
                description: descMatch ? descMatch[1] : null,
                outputs: outputsMatch
                    ? outputsMatch[1]
                          .split(",")
                          .map(s => s.trim().replace(/^["']|["']$/g, ""))
                    : []
            });
            continue;
        }

        const mm = l.match(/^([a-zA-Z0-9_]+)\s*=\s*["']?([^"']+)["']?/);
        if (mm) {
            inv.push({ name: mm[1], value: mm[2] });
        }
    }

    return inv;
}

function parseRules(lines) {
    return lines.map(l => {
        const m = l.match(/^([\w_-]+)\s*->\s*([\w_-]+)/);
        if (m) return { from: m[1], to: m[2] };
        return { raw: l };
    });
}

function parseMap(lines) {
    const map = {};
    for (const l of lines) {
        const m = l.match(/^([\w_-]+)\s*:\s*([\w\.\-_]+)/);
        if (m) map[m[1]] = m[2];
    }
    return map;
}

function parseExpected(lines) {
    const s = {};
    for (const l of lines) {
        const kv = parseKV(l);
        if (kv) s[kv.key] = kv.val;
    }
    return s;
}

// ---------------------------------------------
// Main Kernel Parser
// ---------------------------------------------
function parseARC(filePath) {
    const text = fs.readFileSync(filePath, "utf8");
    const lines = text.split(/\r?\n/).map(l => l.replace(/\t/g, " ").trim());

    const ast = {
        type: "kernel",
        name: null,
        meta: {},
        invokes: [],
        map: {},
        rules: [],
        expected_state: {}
    };

    let idx = 0;

    while (idx < lines.length) {
        const l = lines[idx];
        if (!l) {
            idx++;
            continue;
        }

        const m = l.match(/^kernel\s+([A-Za-z0-9_]+)\s*\{/);
        if (m) {
            ast.name = m[1];
            idx++;

            while (idx < lines.length) {
                const cur = lines[idx].trim();
                if (cur === "}") {
                    idx++;
                    break;
                }

                // meta { ... }
                if (cur.startsWith("meta")) {
                    const { block, nextIdx } = parseBlockLines(lines, idx + 1);
                    block.forEach(bl => {
                        const kv = parseKV(bl);
                        if (kv) ast.meta[kv.key] = kv.val;
                    });
                    idx = nextIdx;
                    continue;
                }

                // invoke { ... }
                if (cur.startsWith("invoke")) {
                    const { block, nextIdx } = parseBlockLines(lines, idx);
                    ast.invokes = ast.invokes.concat(parseInvokeBlock(block));
                    idx = nextIdx;
                    continue;
                }

                // map { ... }
                if (cur.startsWith("map")) {
                    const { block, nextIdx } = parseBlockLines(lines, idx + 1);
                    ast.map = Object.assign(ast.map, parseMap(block));
                    idx = nextIdx;
                    continue;
                }

                // rules { ... }
                if (cur.startsWith("rules")) {
                    const { block, nextIdx } = parseBlockLines(lines, idx + 1);
                    ast.rules = ast.rules.concat(parseRules(block));
                    idx = nextIdx;
                    continue;
                }

                // expected_state { ... }
                if (cur.startsWith("expected_state")) {
                    const { block, nextIdx } = parseBlockLines(lines, idx + 1);
                    ast.expected_state = Object.assign(ast.expected_state, parseExpected(block));
                    idx = nextIdx;
                    continue;
                }

                idx++;
            }
        } else {
            idx++;
        }
    }

    if (!ast.name) ast.name = path.basename(filePath, ".arc");
    return ast;
}

module.exports = { parseARC };
