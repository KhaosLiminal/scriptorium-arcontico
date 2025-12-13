// engine/convert_reel.js
// -----------------------------------------------------------
// ✨ ARC → JSON CONVERTER (Reels / Pipelines Audiovisuales)
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
        throw new Error(`⌛ ARC file not found: ${abs}`);
    }
    return fs.readFileSync(abs, "utf8");
}

// -----------------------------------------------------------
// Conversor principal: ARC → JSON
// -----------------------------------------------------------
export function convertReelArcToJson(arcText) {
    const parsed = parseArcRitual(arcText);
    const root = parsed.ast;

    const json = {
        reel: root.name || "unnamed_reel",
        meta: root.meta || {},
        assets: root.assets || {},
        timeline: root.timeline || [],  // ← directo, sin transformación
        styles: root.styles || {}
    };

    return json;
}

// -----------------------------------------------------------
// CLI MODE — invocación desde terminal
// -----------------------------------------------------------
if (process.argv[1] === __filename) {
    const arcPath = process.argv[2];
    const outputFlagIndex = process.argv.indexOf("-o");
    let outPath = null;

    if (!arcPath) {
        console.error("Uso:");
        console.error(" node convert_reel.js <archivo.arc> -o <salida.capcut.json>");
        process.exit(1);
    }

    if (outputFlagIndex !== -1 && process.argv[outputFlagIndex + 1]) {
        outPath = process.argv[outputFlagIndex + 1];
    } else {
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