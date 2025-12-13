// engine/convert_reel.js
// -----------------------------------------------------------
// ✦ ARC → JSON CONVERTER (Reels / Pipelines Audiovisuales)
// Scriptorium Arcóntico — Módulo híbrido de preproducción
// -----------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseArcRitual } from "../parser/arc_ritual_parser.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------
// Helper: carga archivo .arc
// -----------------------------------------------------------
function loadArcFile(filepath) {
    const abs = path.resolve(filepath);
    if (!fs.existsSync(abs)) {
        throw new Error(`❌ ARC file not found: ${abs}`);
    }
    return fs.readFileSync(abs, "utf8");
}

// -----------------------------------------------------------
// Normalización de nodos ARC a estructura JSON
// -----------------------------------------------------------
function arcNodeToJson(node) {
    if (!node) return null;

    switch (node.type) {
        case "meta":
        case "assets":
        case "timeline":
        case "styles":
            return node.value || node.children || {};

        case "section":
            return {
                name: node.name,
                ...node.body
            };

        case "list":
            return node.items;

        default:
            return node;
    }
}
// -----------------------------------------------------------
// Normaliza segmentos ARC → bloques timeline plano
// -----------------------------------------------------------
function normalizeTimeline(timelineNode) {
    if (!timelineNode || !Array.isArray(timelineNode.children)) return [];

    const blocks = [];

    for (const seg of timelineNode.children) {
        if (!seg) continue;

        // Segmentos estilo "0-3s"
        if (seg.range || seg.name?.includes("-")) {
            const range = seg.range || seg.name;
            const [s, e] = range.replace(/s/g, "").split("-").map(Number);

            blocks.push({
                start: s,
                end: e,
                duration: (e - s),
                img: seg.img,
                text: seg.text
            });

            continue;
        }

        // Segmentos estilo "segment 0-3s { ... }"
        if (seg.start !== undefined && seg.end !== undefined) {
            blocks.push({
                start: seg.start,
                end: seg.end,
                duration: seg.end - seg.start,
                img: seg.img,
                text: seg.text
            });
        }
    }

    return blocks;
}

// -----------------------------------------------------------
// Conversor principal: ARC → JSON
// -----------------------------------------------------------
export function convertReelArcToJson(arcText) {
    const parsed = parseArcRitual(arcText);
    const root = parsed.ast;

    const json = {
    reel: root.name || "unnamed_reel",
    meta: arcNodeToJson(root.meta),
    assets: arcNodeToJson(root.assets),
    timeline: normalizeTimeline(root.timeline),
    styles: arcNodeToJson(root.styles)
};


    return json;
}

// -----------------------------------------------------------
// CLI MODE — permite invocarlo desde terminal
// -----------------------------------------------------------
// -----------------------------------------------------------
// CLI MODE — permite invocarlo desde terminal
// -----------------------------------------------------------
if (process.argv[1] === __filename) {
    const arcPath = process.argv[2];
    const outputFlagIndex = process.argv.indexOf("-o");
    let outPath = null;

    if (!arcPath) {
        console.error("Uso:");
        console.error("  node convert_reel.js <archivo.arc> -o <salida.capcut.json>");
        process.exit(1);
    }

    // Si el usuario indica salida con -o
    if (outputFlagIndex !== -1 && process.argv[outputFlagIndex + 1]) {
        outPath = process.argv[outputFlagIndex + 1];
    } else {
        // Si no indica salida → usar .capcut.json como default
        outPath = arcPath.replace(/\.arc$/, ".capcut.json");
    }

    console.log("⎇ ARC → JSON");
    console.log("Leyendo archivo:", arcPath);

    const text = loadArcFile(arcPath);
    const json = convertReelArcToJson(text);

    fs.writeFileSync(outPath, JSON.stringify(json, null, 2), "utf8");

    console.log("✔ Archivo convertido:");
    console.log("  →", outPath);
}
