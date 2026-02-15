// parser/arc_parser.js
function parseRitualHeader(source) {
    const match = source.match(/kerigma\s+([a-zA-Z_][\w]*)\s*\{/);
    return match ? match[1] : null;
}

function parseTopLevel(source) {
    const blocks = [];
    const regex = /([a-zA-Z_]+)\s*\{([\s\S]*?)\}/g;

    let match;
    while ((match = regex.exec(source)) !== null) {
        blocks.push({
            name: match[1],
            body: match[2].trim()
        });
    }

    return blocks;
}

function parseActions(block) {
    const actions = [];
    const lines = block.body.split("\n");

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith("emit_text")) {
            const text = trimmed.match(/"(.*)"/)?.[1];
            actions.push({ type: "emit_text", args: { text } });
        }

        if (trimmed.startsWith("wait")) {
            const ms = Number(trimmed.match(/\d+/)?.[0]);
            actions.push({ type: "wait", args: { ms } });
        }

        if (trimmed.startsWith("log")) {
            const message = trimmed.match(/"(.*)"/)?.[1];
            actions.push({ type: "log", args: { message } });
        }
    }

    return actions;
}

/* =========================
   🔑 ESTA FUNCIÓN FALTABA
   ========================= */
export function parseARC(source) {
    const name = parseRitualHeader(source);

    const ast = {
        type: "ritual",
        name,
        sections: []
    };

    const topLevelBlocks = parseTopLevel(source);

    const sections = [];

    for (const block of topLevelBlocks) {

        if (block.name === "meta") continue;
        if (block.name === "assets") continue;
        if (block.name === "styles") continue;

        sections.push({
            type: "step",
            name: block.name,
            actions: parseActions(block)
        });
    }

    ast.sections = sections;
    return ast;
}
