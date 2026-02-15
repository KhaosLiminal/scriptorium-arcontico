// engine/exporters/capcut_exporter.js
import fs from "fs";
import path from "path";

export function exportToCapCut(ritual, ctx = {}) {
    const outDir = ctx.outDir || "pipelines/capcut_pack/madonna_hibrida_pack";

    // 🔑 USAR TIMELINE POÉTICO DEL CONTEXTO
    const clips = (ctx.timeline || []).map((c, i) => ({
        id: i,
        type: c.clipType ?? c.type,
        src: c.src ?? null,
        text: c.value ?? null,
        start: c.start,
        duration: c.duration ?? 0,
        layer: c.layer ?? 0,
        style: c.style ?? {}
    }));

    const project = {
        name: ritual.name || "ritual_sin_nombre",
        fps: 30,
        resolution: "1080x1920",
        tracks: {
            video: clips.filter(c => c.type !== "audio"),
            audio: clips.filter(c => c.type === "audio")
        }
    };

    const file = path.join(
        outDir,
        `${ritual.name || "ritual_sin_nombre"}.capcut.json`
    );

    // Asegurar que el directorio existe
    if (!fs.existsSync(path.dirname(file))) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
    }

    fs.writeFileSync(file, JSON.stringify(project, null, 2), "utf-8");
    return file;
}
