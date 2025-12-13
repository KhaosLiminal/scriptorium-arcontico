// -----------------------------------------------------------
// arc_to_capcut.js  (MÓDULO PURAMENTE IMPORTABLE)
// Ya NO incluye CLI
// Solo expone: arcToCapCut(ast)
// -----------------------------------------------------------

export function arcToCapCut(ast) {

    const images = [];
    const texts = [];
    let audio = null;

    // Convert assets
    for (const [k, v] of Object.entries(ast.assets || {})) {
        if (k.startsWith("img")) {
            images.push({ id: k, path: v });
        }
        if (k === "audio_main") {
            audio = { id: k, path: v, volume: 1.0 };
        }
    }

    // Convert timeline
    const clipsImages = [];
    const clipsTexts = [];
    let textCount = 1;

    for (const block of ast.timeline) {
        clipsImages.push({
            id: "ci" + textCount,
            material_id: block.img,
            start: block.start,
            duration: block.duration,
            transition: { type: ast.styles.transition || "crossfade", duration: 600 }
        });

        clipsTexts.push({
            id: "ct" + textCount,
            material_id: "t" + textCount,
            start: block.start + 200,
            duration: block.duration - 400,
            motion: { type: ast.styles.motion || "fade_up", duration: 600 }
        });

        texts.push({
            id: "t" + textCount,
            content: block.text,
            font: ast.styles.font || "Bodoni",
            size: 72,
            color: ast.styles.text_color || "#FFFFFF",
            align: "center"
        });

        textCount++;
    }

    // Resultado final
    return {
        draft: {
            id: ast.reel,
            name: ast.meta.theme,
            create_time: Date.now(),
            duration: 30000,
            cover_material_id: images[0]?.id
        },

        canvas: {
            width: 1080,
            height: 1920,
            background: "#000000",
            mode: "portrait"
        },

        materials: {
            images,
            audio: audio ? [audio] : [],
            texts
        },

        tracks: [
            { id: "track_images", type: "video", clips: clipsImages },
            { id: "track_text", type: "text", clips: clipsTexts },
            {
                id: "track_audio",
                type: "audio",
                clips: audio
                    ? [{
                        id: "audio_clip",
                        material_id: "audio_main",
                        start: 0,
                        duration: 30000,
                        fade_in: 1200,
                        fade_out: 1500
                    }]
                    : []
            }
        ]
    };
}

