// engine/convert.js

/**
 * Convierte un bloque "action X" en una acción ejecutable:
 *   action invoke { name = "threshold.open" }
 * → { type: "invoke", args: { name: "threshold.open" } }
 */
function convertActionBlock(block) {
    const [, actionName] = block.name.split(" "); // "action invoke" → ["action", "invoke"]

    const args = {};
    for (const entry of block.body) {
        if (entry.action) {
            args[entry.action] = entry.value;
        } else if (entry.item) {
            // fallback: item sin clave → se asigna como "value"
            args.value = entry.item;
        }
    }
    return {
        type: actionName,
        args
    };
}

/**
 * Convierte un AST completo en un ritual ejecutable:
 * { sections: [...] } → { name, steps: [ {name, actions:[...] } ] }
 */
export function convertDocument(ast) {
    const ritual = {
        name: ast.name || "ritual_sin_nombre",
        steps: []
    };

    let currentStep = null;

    for (const section of ast.sections) {
        if (section.type === "step") {
            // Creamos paso nuevo
            currentStep = {
                name: section.name,
                actions: []
            };
            ritual.steps.push(currentStep);
            continue;
        }

        if (section.type === "block" && section.name.startsWith("action")) {
            if (!currentStep) {
                // Si hay acciones antes de un step, creamos step implícito
                currentStep = {
                    name: "inicio",
                    actions: []
                };
                ritual.steps.push(currentStep);
            }
            const act = convertActionBlock(section);
            currentStep.actions.push(act);
            continue;
        }

        // Ignorar meta, require y otros bloques
    }

    return ritual;
}

export default { convertDocument };
