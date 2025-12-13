semana semana_01_origen {

    meta {
        version: "1.0"
        nombre: "Semana 01 — ORIGEN"
        tono_general: "divino/profano + editorial + híbrido total"
        estado: "activo"
    }

    // -----------------------------------------------------
    //  ESTRUCTURA DE PUBLICACIONES
    // -----------------------------------------------------
    dias {

        lunes: {
            tipo: "story"
            archivo: "pipelines/stories/story_manifesto.arc"
            descripcion: "Apertura del manifiesto visual — lo sagrado fracturado."
        }

        martes: {
            tipo: "reel"
            archivo: "pipelines/reels/reel_madonna_hibrida_acto2.arc"
            descripcion: "Acto II — Resonancia. Primer reel núcleo de la Madonna Híbrida."
        }

        miercoles: {
            tipo: "feed"
            archivo: "pipelines/feed/divino.arc"
            descripcion: "Feed divino — Madonna como figura luminosa."
        }

        jueves: {
            tipo: "feed"
            archivo: "pipelines/feed/profano.arc"
            descripcion: "Feed profano — cuerpo glitch como iconografía híbrida."
        }

        viernes: {
            tipo: "carrusel"
            archivo: "pipelines/carruseles/reflexivo.arc"
            descripcion: "Carrusel reflexivo — origen como pregunta expandida."
        }

        sabado: {
            tipo: "experimental"
            archivo: "pipelines/experimental/pieza_origen.arc"
            descripcion: "Pieza experimental — ruido como plegaria sin templo."
        }

        domingo: {
            tipo: "kerigma"
            archivo: "pipelines/kerigma/silencio_arconte.arc"
            descripcion: "Kerigma — Primera aparición del Silencio del Arconte."
        }
    }

    // -----------------------------------------------------
    //  CONTROL DE VERSIONADO
    // -----------------------------------------------------
    control {
        ultima_edicion: "manual"
        automatizaciones: false
        auditoria_visual: true
    }

    // -----------------------------------------------------
    //  ESTÉTICAS CONSOLIDADAS PARA TODA LA SEMANA
    // -----------------------------------------------------
    estilos {
        font_primaria: "Bodoni"
        font_secundaria: "HelveticaNeue-Light"
        color_texto_global: "#FFFFFF"
        motion_global: "fade_up_suave"
        transiciones_globales: "crossfade_600ms"
        formato_general: "portrait"
    }

    // -----------------------------------------------------
    //  NOTAS CURATORIALES (PARA TI / PARA EL ARCONTE)
    // -----------------------------------------------------
    notas {
        1: "La Madonna Híbrida es el eje de esta primera semana."
        2: "Mantener tono editorial silencioso, imágenes limpias."
        3: "El domingo siempre es el kerigma del proyecto."
        4: "Evitar saturación — cada pieza debe sentirse respirada."
        5: "Objetivo de la Semana 1: inaugurar el canon híbrido."
    }
}
