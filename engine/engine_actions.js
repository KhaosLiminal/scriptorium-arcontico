const actions = {

    print: async (text, ctx) => {
        // Si text es un objeto, extraer el valor
        const message = (typeof text === 'object' && text.text) ? text.text : text;
        
        // Agregar al timeline con duración poética
        const start = ctx.cursor ?? 0;
        const duration = 2; // duración corta para print
        
        ctx.timeline.push({
            type: "clip",
            clipType: "text",
            value: message,
            start,
            duration,
            layer: 1,
            style: { opacity: 0.9 }
        });
        
        ctx.cursor = start + duration;
        console.log("📄", message);
        return { ok: true };
    },

    invoke: async (command, ctx) => {
        const start = ctx.cursor ?? 0;
        const duration = 1.5; // duración para invoke
        
        ctx.timeline.push({
            type: "clip",
            clipType: "invoke",
            value: command,
            start,
            duration,
            layer: 2,
            style: { opacity: 0.7, filter: "glow" }
        });
        
        ctx.cursor = start + duration;
        console.log("⚡", command);
        return { ok: true };
    },

    log: async (message, ctx) => {
        const start = ctx.cursor ?? 0;
        const duration = 1; // duración para log
        
        ctx.timeline.push({
            type: "clip",
            clipType: "log",
            value: message,
            start,
            duration,
            layer: 0,
            style: { opacity: 0.6, fontSize: "0.8em" }
        });
        
        ctx.cursor = start + duration;
        console.log("📝", message);
        return { ok: true };
    },

    emit_text: async ({ text, duration = 3, layer = 1 }, ctx) => {
        const start = ctx.cursor ?? 0;

        ctx.timeline.push({
            type: "clip",
            clipType: "text",
            value: text,
            start,
            duration,
            layer,
            style: ctx.styles ?? {}
        });

        ctx.cursor = start + duration;
        console.log("🗣️", text);
        return { ok: true };
    },

    emit_silence: async ({ ms = 1000 }, ctx) => {
        const start = ctx.cursor ?? 0;
        const duration = ms / 1000;

        ctx.timeline.push({
            type: "audio",
            clipType: "silence",
            src: null,
            start,
            duration,
            layer: 0,
            style: { type: "pause" }
        });

        ctx.cursor = start + duration;
        console.log("⏸️", `Silencio ${ms}ms`);
        return { ok: true };
    },

    emit_breath: async ({ intensity = "medio" }, ctx) => {
        const start = ctx.cursor ?? 0;
        const duration = intensity === "profundo" ? 2 : 1;
        
        ctx.timeline.push({
            type: "audio",
            clipType: "breath",
            src: null,
            start,
            duration,
            layer: 0,
            style: { intensity, type: "respiración" }
        });

        ctx.cursor = start + duration;
        console.log("🌬️", `Respiración ${intensity}`);
        return { ok: true };
    }

};

export default actions;
