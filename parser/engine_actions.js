// parser/engine_actions.js

/**
 * Engine Actions Registry
 * -----------------------
 * Maps action names to JavaScript functions
 * that the engine is allowed to execute.
 *
 * NOTE:
 * This file only defines available actions.
 * The runner executes them.
 */

const actions = {
    log: ({ message }) => {
        console.log("🟦 [ARC LOG]:", message);
        return { ok: true };
    },

    wait: async ({ ms }) => {
        console.log(`⏳ Esperando ${ms}ms...`);
        await new Promise(res => setTimeout(res, ms));
        return { ok: true };
    },

    state_set: ({ key, value }, state) => {
        state[key] = value;
        return { ok: true };
    },

    state_increment: ({ key, amount }, state) => {
        state[key] = (state[key] || 0) + amount;
        return { ok: true, value: state[key] };
    },

    invoke: async ({ target }, ctx) => {
        console.log(`⚡ Invocando: ${target}`);
        if (!ctx || !ctx.invoke) {
            throw new Error("Contexto inválido: falta ctx.invoke");
        }
        return await ctx.invoke(target);
    }
};

/**
 * Retrieve an action handler safely.
 */
function getAction(name) {
    const a = actions[name];
    if (!a) {
        throw new Error(`Acción desconocida: ${name}`);
    }
    return a;
}

module.exports = {
    actions,
    getAction
};
