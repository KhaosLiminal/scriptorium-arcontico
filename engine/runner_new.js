import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import main from "../parser/index.js";
import actions from "./engine_actions.js";
import { exportToCapCut } from "./exporters/capcut_exporter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔥 RUNNER NUEVO ACTIVO - Pipeline Moderno");

const file = process.argv[2];
if (!file) {
    console.error("❌ Debes indicar un archivo .arc");
    process.exit(1);
}

const abs = path.resolve(file);
console.log("📜 Ejecutando:", abs);

// ---- usar nuestro nuevo pipeline ----
console.log("🔍 Parseando ritual con pipeline moderno...");
const ritual = await main(abs);

console.log("\n==============================");
console.log("🏺 Ritual:", ritual.name);
console.log("🧩 Pasos:", ritual.steps?.length || 0);
console.log("==============================\n");

// ---- contexto ----
const ctx = {
    state: {},
    timeline: [],
    cursor: 0,
    assets: ritual.assets ?? {},
    styles: ritual.styles ?? {}
};

// ---- runner ----
async function runRitual(ritual, ctx) {
    console.log("🚀 Ejecutando ritual...\n");

    for (const step of ritual.steps) {
        console.log(`🔹 Paso: ${step.name}`);
        console.log("-".repeat(40));

        for (const action of step.actions) {
            const fn = actions[action.type];

            console.log(`  → ${action.type}()`, action.value || action.args);

            if (!fn) {
                console.log(`  ⚠️ Acción desconocida: ${action.type}`);
                continue;
            }

            await fn(action.value || action.args, ctx);
            
            // Agregar silencios poéticos entre acciones
            if (Math.random() > 0.7) {
                await actions.emit_silence({ ms: 500 }, ctx);
            }
        }
    }

    console.log("\n🏁 Ritual completado.");
    console.log("🧠 Estado final:", ctx.state);
}

// 🔑 EJECUTAR RITUAL
await runRitual(ritual, ctx);

// ---- exportación ----
console.log("🎬 CapCut exportado en:");
console.log("🔍 DEBUG - Timeline antes de exportar:", JSON.stringify(ctx.timeline, null, 2));
const capcutPath = exportToCapCut(ritual, ctx);
console.log(capcutPath);

console.log("✅ Runner nuevo finalizó correctamente");
