// parser/arc_ritual_transform.js
/**
 * Transformador específico para rituales ARC generados por Kraken
 * Convierte el AST "document" a formato ejecutable del engine
 */

function transformDocumentToRitual(ast) {
    if (!ast || ast.type !== "document") {
        throw new Error("transformDocumentToRitual: AST inválido o no es de tipo document.");
    }

    // El ritual puede estar en diferentes estructuras
    let ritualName = "ritual_sin_nombre";
    let meta = {};
    let requires = {};
    let steps = [];

    // Buscar metadatos en sección meta
    const metaSection = ast.sections.find(section => 
        section.type === "block" && section.name === "meta"
    );
    
    if (metaSection) {
        metaSection.body.forEach(item => {
            if (item.key) {
                meta[item.key] = item.value;
            }
        });
    }

    // Buscar requerimientos en sección require
    const requireSection = ast.sections.find(section => 
        section.type === "block" && section.name === "require"
    );
    
    if (requireSection) {
        requireSection.body.forEach(item => {
            if (item.item) {
                requires.core = requires.core || [];
                requires.core.push(item.item);
            }
        });
    }

    // Extraer pasos de las secciones de tipo "step"
    ast.sections.forEach(section => {
        if (section.type === "step") {
            const step = {
                name: section.name,
                type: null,
                actions: []
            };

            // Extraer acciones del step
            if (section.actions) {
                section.actions.forEach(action => {
                    if (action.print) {
                        step.actions.push({
                            type: "print",
                            value: action.print.text
                        });
                    }
                });
            }

            steps.push(step);
        }
    });

    // Si no hay steps, buscar bloques que parezcan pasos
    if (steps.length === 0) {
        const stepNames = ["abrir_umbral", "sincronizar_nucleo", "invocar_arconte", "confirmar_operatividad", "sellar"];
        
        stepNames.forEach(stepName => {
            const stepSection = ast.sections.find(section => 
                section.type === "block" && section.name === stepName
            );
            
            if (stepSection) {
                const step = {
                    name: stepName,
                    type: null,
                    actions: []
                };

                // Buscar acciones relacionadas
                const relatedSections = ast.sections.filter(section => 
                    section.type === "block" && 
                    (section.name === "print" || section.name === "log" || section.name === "invoke")
                );

                relatedSections.forEach(relSection => {
                    if (relSection.body && relSection.body.length > 0) {
                        relSection.body.forEach(item => {
                            if (item.key === "text") {
                                step.actions.push({
                                    type: relSection.name,
                                    value: item.value
                                });
                            } else if (item.key === "name") {
                                step.actions.push({
                                    type: "invoke",
                                    value: item.value
                                });
                            }
                        });
                    }
                });

                steps.push(step);
            }
        });
    }

    return {
        type: "ritual",
        name: ritualName,
        meta: meta,
        requires: requires,
        steps: steps,
        timeline: []
    };
}

function transform(ast) {
    if (!ast) throw new Error("AST nulo recibido en transform().");

    switch (ast.type) {
        case "document":
            return transformDocumentToRitual(ast);
        
        default:
            throw new Error(`Tipo de AST desconocido en transform(): ${ast.type}`);
    }
}

export default transform;
