reel kerigma_silencio_arconte_acto5 {

    meta {
        version = "1.0"
        acto = "V"
        titulo = "Coronación del Silencio"
        duracion = "30s"
        tono = "litúrgico, severo, absoluto, coronación sin ceremonia"
        audio = "audio/silencio_arconte.wav"
    }

    assets {
        img1 = "assets/arconte/13.jpg"
        img2 = "assets/arconte/14.jpg"
        img3 = "assets/arconte/15.jpg"
        img4 = "assets/arconte/16.jpg"
    }

    timeline {

        // 0–4s
        range 0-4 {
            img = img1
            text = "El silencio tomó su sitio."
        }

        // 4–9s
        range 4-9 {
            img = img1
            text = "La altura dejó de ser una distancia."
        }

        // 9–15s
        range 9-15 {
            img = img2
            text = "El Arconte volvió su forma una sentencia."
        }

        // 15–21s
        range 15-21 {
            img = img3
            text = "Y la piedra reconoció a su señor."
        }

        // 21–27s
        range 21-27 {
            img = img3
            text = "La luz se inclinó sin perder su filo."
        }

        // 27–30s — epílogo
        range 27-30 {
            img = img4
            text = "Acto V: Coronación del Silencio."
        }
    }

    styles {
        font_primary = "Bodoni"
        font_secondary = "HelveticaNeue-Light"
        color_text = "#FFFFFF"
        motion_text = "fade_up_600"
        transition_images = "crossfade_900"
        caption_style = "editorial_catharsis"
    }
}
