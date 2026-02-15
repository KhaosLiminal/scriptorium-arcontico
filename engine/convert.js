// engine/convert.js
console.log("🧨 CONVERT.JS ACTIVO — VERSION LIMPIA");

export function convertDocument(ast) {
    const ritual = {
        name: ast.name || "ritual_sin_nombre",
        steps: []
    };

    if (!Array.isArray(ast.sections)) {
        console.warn("⚠️ AST sin sections");
        return ritual;
    }

    for (const section of ast.sections) {
        if (section.type !== "step") continue;

        ritual.steps.push({
            name: section.name,
            actions: section.actions || []
        });
    }

    return ritual;
}
