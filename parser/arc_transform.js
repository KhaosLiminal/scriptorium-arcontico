// parser/arc_transform.js

/**
 * ARC Transform
 * -------------
 * Converts parsed ASTs into normalized objects
 * ready for engine execution.
 */

function transformKernel(ast) {
    if (!ast || ast.type !== "kernel") {
        throw new Error("transformKernel: AST inválido o no es de tipo kernel.");
    }

    return {
        type: "kernel",
        name: ast.name,
        meta: ast.meta || {},
        invokes: ast.invokes || [],
        map: ast.map || {},
        rules: ast.rules || [],
        expected_state: ast.expected_state || {}
    };
}

function transformRitual(ast) {
    if (!ast || ast.type !== "ritual") {
        throw new Error("transformRitual: AST inválido o no es de tipo ritual.");
    }

    return {
        type: "ritual",
        name: ast.name,
        description: ast.description || null,
        phases: ast.phases || [],
        meta: ast.meta || {}
    };
}

function transformMock(ast) {
    return {
        type: "mock",
        raw: ast.raw || "",
        meta: ast.meta || {}
    };
}

function transform(ast) {
    if (!ast) throw new Error("AST nulo recibido en transform().");

    switch (ast.type) {
        case "kernel":
            return transformKernel(ast);

        case "ritual":
            return transformRitual(ast);

        case "mock_ast":
            return transformMock(ast);

        default:
            throw new Error(`Tipo de AST desconocido en transform(): ${ast.type}`);
    }
}

module.exports = {
    transform,
    transformKernel,
    transformRitual,
    transformMock
};
