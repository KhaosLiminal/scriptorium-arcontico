export function RitualNode({ name, meta, steps, includes }) {
    return {
        type: "RITUAL",
        name,
        meta: meta || {},
        steps: steps || [],
        includes: includes || []
    };
}

export function StepNode({ name, actions }) {
    return {
        type: "STEP",
        name,
        actions
    };
}

export function ActionNode({ name, args }) {
    return {
        type: "ACTION",
        name,
        args
    };
}
