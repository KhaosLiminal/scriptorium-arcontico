/**
 * ARC RITUAL PARSER v0.4
 * Interpreta rituales ARC (ritual.nombre { ... })
 */

import tokenize from "./arc_lexer.mjs";
import parse from "./arc_ast.js";  // importar la función parse por defecto

export default function parseRitual(filePath, text) {
    console.log(`⟢ Parseando ritual: ${filePath}`);

    const tokens = tokenize(text);
    const ast = parse(tokens);  // usar la función parse importada

    console.log(`⟢ Ritual '${ast.name || "desconocido"}' parseado — ${ast.sections?.length || 0} secciones`);

    return ast;
}