// engine/runner.js

import fs from "fs";
import path from "path";
import { parseARC } from "../parser/arc_parser_mock.js";
import { convertDocument } from "./convert.js";
import actions from "./engine_actions.js";

console.log("🔥 Runner activo");

const file = process.argv[2];
if (!file) throw new Error("Debes indicar un archivo .arc");

const abs = path.resolve(file);
console.log("📂 Archivo solicitado:", file);
console.log("📌 Ruta absoluta:", abs);

console.log("🔍 Parseando ritual...");
const ast = parseARC(abs);

console.log("🔧 Convirtiendo AST a ritual ejecutable...");
const ritual = convertDocument(ast);

console.log("\n==============================");
console.log("🏺 Ritual:", ritual.name);
console.log("🧩 Pasos:", ritual.steps.length);
console.log("==============================\n");

async function run() {
    for (const step of ritual.steps) {
        console.log(`\n🔹 Paso: ${step.name}`);
        console.log("-".repeat(40));
        
        for (const action of step.actions) {
            console.log(`  → ${action.type}()`, action.args);

            const fn = actions[action.type];
            if (!fn) {
                console.log(`  ⚠️ Acción desconocida: ${action.type}`);
                continue;
            }

            try {
                await fn(action.args);
            } catch (err) {
                console.log(`  ❌ Error ejecutando ${action.type}:`, err.message);
            }
        }
    }

    console.log("\n🏁 Ritual completado.");
}

run();
