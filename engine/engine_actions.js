// engine/engine_actions.js

export default {
    async print({ text, value }) {
        console.log("🖨️", text || value || "");
    },

    async log({ text, value }) {
        console.log("📜 LOG:", text || value || "");
    },

    async invoke({ name, value }) {
        console.log("✨ INVOKE:", name || value);
        // Aquí puedes conectar módulos, scripts, etc.
    },

    async wait({ ms, value }) {
        const t = Number(ms || value || 0);
        console.log(`⏳ Esperando ${t}ms...`);
        await new Promise(res => setTimeout(res, t));
    }
};
