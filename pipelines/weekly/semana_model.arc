ritual semana_reflejos_hibridos {

    meta {
        version: "1.0"
        ciclo: "7-dias"
        descripcion: "Pipeline editorial semanal para Reflejos Híbridos"
    }

    lunes {
        type: "story"
        file: "pipelines/stories/story_manifesto.arc"
        objetivo: "apertura del tono"
    }

    martes {
        type: "reel"
        file: "pipelines/reels/current_reel.arc"
        objetivo: "ritual principal"
    }

    miercoles {
        type: "feed"
        file: "pipelines/feed/divino.arc"
        objetivo: "estetica divina"
    }

    jueves {
        type: "feed"
        file: "pipelines/feed/profano.arc"
        objetivo: "estetica profana"
    }

    viernes {
        type: "carrusel"
        file: "pipelines/carruseles/reflexivo.arc"
        objetivo: "transmision conceptual"
    }

    sábado {
        type: "pieza_experimental"
        file: "pipelines/experimental/pieza.arc"
        objetivo: "ruido sagrado"
    }

    domingo {
        type: "kerigma"
        file: "pipelines/kerigma/silencio_arconte.arc"
        objetivo: "mensaje central de la semana"
    }
    control {
  regla: "ninguna pieza se publica sin pasar por el ritual de la semana"
  fallback: "si falla un día, se reabsorbe en el domingo"
}
}

