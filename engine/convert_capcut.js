// PACKS REGISTRADOS
const PACKS = {
    "madonna_hibrida": "pipelines/capcut_pack/madonna_hibrida_pack.zip",
    "silencio_arconte": "pipelines/capcut_pack/kerigma_silencio_arconte.zip"
};
if (process.argv.includes("--install-pack")) {
    const name = process.argv[process.argv.indexOf("--install-pack") + 1];
    if (!PACKS[name]) {
        console.error("Pack desconocido:", name);
        process.exit(1);
    }

    console.log("⟇ Instalando pack:", name);

    const zipPath = PACKS[name];
    const dest = `pipelines/reels/${name}/`;

    const { execSync } = await import("node:child_process");

    execSync(`powershell -File tools/import_capcut.ps1 -zip "${zipPath}" -dest "${dest}"`, { stdio: "inherit" });

    console.log("✔ Instalación finalizada.");
    process.exit(0);
}
// -----------------------------------------------------------
// MERGE DE MULTIPLES REELS CAPCUT
// -----------------------------------------------------------
if (process.argv.includes("--merge-reels")) {
    const name = process.argv[process.argv.indexOf("--merge-reels") + 1];
    if (!name) {
        die("Debes indicar el nombre del reel pack. Ej: --merge-reels madonna_hibrida");
    }

    const base = path.resolve(`pipelines/reels/${name}/`);
    if (!fs.existsSync(base)) {
        die("No existe el directorio del pack: " + base);
    }

    log("⟇ MERGE REELS:", name);
    log("Carpeta:", base);

    // Leer todos los .capcut.json
    const files = fs.readdirSync(base)
        .filter(f => f.endsWith(".capcut.json"))
        .map(f => path.join(base, f))
        .sort(); // mantiene orden alfabético (acto2 → acto3 → acto4 → template → master)

    if (files.length === 0) {
        die("No se encontraron archivos .capcut.json en: " + base);
    }

    log("Archivos detectados:");
    files.forEach(f => log("  →", path.basename(f)));

    // Estructura base del CapCut final
    const merged = {
        draft: {
            id: name + "_merged",
            name: name + "_merged",
            create_time: Date.now(),
            duration: 0,
            cover_material_id: null
        },
        canvas: {
            width: 1080,
            height: 1920,
            background: "#000000",
            mode: "portrait"
        },
        materials: {
            images: [],
            audio: [],
            texts: []
        },
        tracks: [
            { id: "track_images", type: "video", clips: [] },
            { id: "track_text", type: "text", clips: [] },
            { id: "track_audio", type: "audio", clips: [] }
        ]
    };

    let t = 0; // acumulador de tiempo para concatenar

    for (const file of files) {
        const json = JSON.parse(fs.readFileSync(file, "utf8"));

        // MERGE DE MATERIALS
        merged.materials.images.push(...json.materials.images);
        merged.materials.texts.push(...json.materials.texts);
        merged.materials.audio.push(...json.materials.audio);

        // MERGE DE TRACKS (Shift de tiempos)
        for (const clip of json.tracks[0]?.clips || []) {
            merged.tracks[0].clips.push({
                ...clip,
                start: clip.start + t
            });
        }
        for (const clip of json.tracks[1]?.clips || []) {
            merged.tracks[1].clips.push({
                ...clip,
                start: clip.start + t
            });
        }
        for (const clip of json.tracks[2]?.clips || []) {
            merged.tracks[2].clips.push({
                ...clip,
                start: clip.start + t
            });
        }

        // Acumular duración para el siguiente acto
        const last = json.tracks[0]?.clips.slice(-1)[0];
        if (last) t += (last.start + last.duration);
    }

    merged.draft.duration = t;

    const out = path.join(base, `${name}_merged.capcut.json`);
    fs.writeFileSync(out, JSON.stringify(merged, null, 2), "utf8");

    log("✔ MERGE completado.");
    log("→", out);
    process.exit(0);
}
// engine/convert_capcut.js
// -----------------------------------------------------------
// ARC → CapCut JSON Converter (Versión final Scriptorium)
// -----------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { parseArcRitual } from "../parser/arc_ritual_parser.js";

// Para rutas ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function die(msg) {
    console.error("✖ ERROR:", msg);
    process.exit(1);
}

function log(...msg) {
    console.log(...msg);
}

// Normaliza timeline: convierte string "0-3s" en start/end ms
function parseRange(str) {
    if (!str) return { start: 0, duration: 2000 };
    const m = str.match(/(\d+)-(\d+)s/);
    if (!m) return { start: 0, duration: 2000 };

    const start = parseInt(m[1]) * 1000;
    const end = parseInt(m[2]) * 1000;
    return { start, duration: end - start };
}

// -----------------------------------------------------------
// Conversor ARC → CapCut
// -----------------------------------------------------------

function arcToCapCut(ast) {
    const meta = ast.meta || {};
    const assets = ast.assets || {};
    const timeline = ast.timeline || [];
    const styles = ast.styles || {};

    return {
        draft: {
            id: meta.id || ast.reel || "arc_reel",
            name: meta.theme || "ARC Reel",
            create_time: Date.now(),
            duration: parseInt((meta.duration || "30s").replace("s", "")) * 1000,
            cover_material_id: meta.img || Object.keys(assets)[0] || null
        },

        canvas: {
            width: 1080,
            height: 1920,
            background: "#000000",
            mode: "portrait"
        },

        materials: {
            images: Object.keys(assets)
                .filter(k => k.startsWith("img"))
                .map(k => ({
                    id: k,
                    path: assets[k]
                })),

            audio: assets.audio
                ? [
                    {
                        id: "audio_main",
                        path: assets.audio,
                        volume: 1.0
                    }
                ]
                : [],

            texts: timeline
                .map((block, i) => {
                    if (!block.props?.text) return null;
                    return {
                        id: `t${i + 1}`,
                        content: block.props.text,
                        font: styles.font_primary || "Bodoni",
                        size: 64,
                        color: styles.color_text || "#FFFFFF",
                        align: "center"
                    };
                })
                .filter(Boolean)
        },

        tracks: [
            {
                id: "track_images",
                type: "video",
                clips: timeline.map((block, i) => {
                    const { start, duration } = parseRange(block.props.range);
                    return {
                        id: `c${i + 1}`,
                        material_id: block.props.img,
                        start,
                        duration,
                        transition: {
                            type: styles.transition_images || "crossfade",
                            duration: 600
                        }
                    };
                })
            },

            {
                id: "track_text",
                type: "text",
                clips: timeline.map((block, i) => {
                    if (!block.props.text) return null;
                    const { start, duration } = parseRange(block.props.range);
                    return {
                        id: `txt${i + 1}`,
                        material_id: `t${i + 1}`,
                        start: start + 300,
                        duration: duration - 400,
                        motion: {
                            type: styles.motion_text || "fade_up",
                            duration: 600
                        }
                    };
                }).filter(Boolean)
            },

            {
                id: "track_audio",
                type: "audio",
                clips: assets.audio
                    ? [
                        {
                            id: "audio_clip",
                            material_id: "audio_main",
                            start: 0,
                            duration: parseInt((meta.duration || "30s").replace("s", "")) * 1000,
                            fade_in: 1200,
                            fade_out: 1500
                        }
                    ]
                    : []
            }
        ]
    };
}

// -----------------------------------------------------------
// CLI
// -----------------------------------------------------------

const inputFile = process.argv[2];
if (!inputFile) die("Debes indicar un archivo .arc");

const fullIn = path.resolve(process.cwd(), inputFile);
if (!fs.existsSync(fullIn)) die("Archivo no encontrado: " + fullIn);

log("⟇ ARC → CapCut");
log("Leyendo:", inputFile);

const raw = fs.readFileSync(fullIn, "utf8");

const parsed = parseArcRitual(raw);
if (!parsed.ok) die("El parser ritual falló.");

const outputAst = parsed.ast;
const capcut = arcToCapCut(outputAst);

const outFile = fullIn.replace(/\.arc$/, ".capcut.json");
fs.writeFileSync(outFile, JSON.stringify(capcut, null, 2), "utf8");

log("✔ Exportado:");
log("  →", outFile);
// -----------------------------------------------------------
// Conversión ARC → CapCut JSON (modo simple)
// -----------------------------------------------------------
if (
    !process.argv.includes("--install-pack") &&
    !process.argv.includes("--merge-reels") &&
    process.argv[1] === fileURLToPath(import.meta.url)
) {
    const arcPath = process.argv[2];
    const outFlag = process.argv.indexOf("-o");
    let outPath = null;

    if (!arcPath || !arcPath.endsWith(".arc")) {
        console.error("Uso:");
        console.error("  node convert_capcut.js <archivo.arc> [-o salida.capcut.json]");
        process.exit(1);
    }

    if (!fs.existsSync(arcPath)) {
        console.error("Archivo no encontrado:", arcPath);
        process.exit(1);
    }

    if (outFlag !== -1 && process.argv[outFlag + 1]) {
        outPath = process.argv[outFlag + 1];
    } else {
        outPath = arcPath.replace(/\.arc$/, ".capcut.json");
    }

    console.log("⟇ ARC → CapCut");
    console.log("Leyendo:", arcPath);

    const raw = fs.readFileSync(arcPath, "utf8");
    const parsed = parseArcRitual(raw);

    if (!parsed.ok) {
        console.error("✖ Parser falló.");
        process.exit(1);
    }

    const capcut = arcToCapCut(parsed.ast);

    fs.writeFileSync(outPath, JSON.stringify(capcut, null, 2), "utf8");

    console.log("✔ Exportado:");
    console.log("  →", outPath);

    process.exit(0);
}
