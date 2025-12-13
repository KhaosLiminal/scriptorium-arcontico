/**
 * TEST PARSER — Pruebas rápidas del stack lexer + parser
 */

import { readFileSync } from "fs";
import tokenize from "./parser/arc_lexer.mjs";
import parseRitual from "./parser/arc_ritual_parser.js";

const testFile = "./rituales/ritual.invocacion.arc";
const content = readFileSync(testFile, "utf8");

console.log("=== TEST LEXER ===");
const tokens = tokenize(content);
console.log(`Tokens generados: ${tokens.length}`);
console.log(tokens.slice(0, 20));  // primeros 20

console.log("\n=== TEST PARSER ===");
try {
    const ritual = parseRitual(testFile, content);
    console.log("Parseo exitoso");
    console.log("Nombre:", ritual.name);
    console.log("Steps:", ritual.steps.length);
    console.log("Meta keys:", Object.keys(ritual.meta));
} catch (err) {
    console.error("Error en parseo:", err.message);
}