/**
 * ARC LEXER v0.4 — Módulo ESM
 * Tokenizador híbrido para lenguaje ARC (rituales y kernels)
 */

function createToken(type, value, line, col = 0) {
    return { type, value, line, col };
}

export default function tokenize(text) {
    const tokens = [];
    let line = 1;
    let col = 0;
    let i = 0;
    let buffer = "";

    const pushBuffer = (type = "IDENT") => {
        if (buffer.trim()) {
            tokens.push(createToken(type, buffer.trim(), line, col - buffer.length));
        }
        buffer = "";
    };

    while (i < text.length) {
        const c = text[i];
        col++;

        if (c === "\n") {
            pushBuffer();
            line++;
            col = 0;
            i++;
            continue;
        }

        // Comentarios # o //
        if (c === "#" || (c === "/" && text[i + 1] === "/")) {
            pushBuffer();
            while (i < text.length && text[i] !== "\n") i++;
            continue;
        }

        // Strings
        if (c === '"' || c === "'") {
            pushBuffer();
            const quote = c;
            let str = c;
            i++;
            col++;
            while (i < text.length && text[i] !== quote) {
                str += text[i];
                if (text[i] === "\n") line++;
                i++;
                col++;
            }
            if (i < text.length) {
                str += text[i];
                i++;
                col++;
            }
            tokens.push(createToken("STRING", str.slice(1, -1), line));
            continue;
        }

        // Símbolos estructurales
        if ("{}[]:,-=>".includes(c)) {
            pushBuffer();
            const map = {
                "{": "LBRACE",
                "}": "RBRACE",
                "[": "LBRACKET",
                "]": "RBRACKET",
                ":": "COLON",
                ",": "COMMA",
                "-": "DASH",
                "=": "EQUALS",
                ">": "ARROW"
            };
            if (c === "-" && text[i + 1] === ">") {
                tokens.push(createToken("ARROW", "->", line, col));
                i += 2;
                col += 2;
                continue;
            }
            tokens.push(createToken(map[c] || c, c, line, col));
            i++;
            col++;
            continue;
        }

        // Espacios y tabs
        if (/\s/.test(c)) {
            pushBuffer();
            i++;
            continue;
        }

        buffer += c;
        i++;
    }

    pushBuffer();
    tokens.push(createToken("EOF", null, line));

    return tokens;
}