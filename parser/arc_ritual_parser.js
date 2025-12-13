/**
 * ARC RITUAL PARSER v0.4
 * Interpreta rituales ARC (ritual.nombre { ... })
 */

import tokenize from "./arc_lexer.mjs";
import buildRitualAST from "./arc_ast.js";  // si tienes separado, o inline

export default function parseRitual(filePath, text) {
    console.log(`⟢ Parseando ritual: ${filePath}`);

    const tokens = tokenize(text);
    const ast = buildRitualAST(tokens);  // tu AST builder para rituales

    console.log(`⟢ Ritual '${ast.name}' parseado — ${ast.steps.length} steps`);

    return ast;
}