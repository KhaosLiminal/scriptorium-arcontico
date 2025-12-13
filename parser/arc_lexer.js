// parser/arc_lexer.js
export function tokenize(input) {
  console.log("🔠 Iniciando tokenización...");
  console.log(
    `📝 Entrada (${input.length} caracteres):`,
    input.substring(0, 100) + (input.length > 100 ? "..." : "")
  );

  const tokens = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  const patterns = [
    { type: "WHITESPACE", regex: /^\s+/ },
    { type: "COMMENT", regex: /^#.*/ },
    { type: "LBRACE", regex: /^\{/ },
    { type: "RBRACE", regex: /^\}/ },
    { type: "LBRACK", regex: /^\[/ },
    { type: "RBRACK", regex: /^\]/ },
    { type: "COLON", regex: /^:/ },
    { type: "EQUALS", regex: /^=/ },
    { type: "COMMA", regex: /^,/ },

    // Strings
    { type: "STRING", regex: /^"([^"\\]|\\.)*"/ },
    { type: "STRING", regex: /^'([^'\\]|\\.)*'/ },

    // PATH detecta rutas con slashes
    { type: "PATH", regex: /^[a-zA-Z0-9_\-.\/]+\/[a-zA-Z0-9_\-.\/]+/ },

    // Numbers
    { type: "NUMBER", regex: /^\d+(\.\d+)?/ },

    // IDENT (no termina con ":")
    {
      type: "IDENT",
      regex: /^[a-zA-Z_][a-zA-Z0-9_\-.]*/
    }
  ];

  while (pos < input.length) {
    let match = null;
    let type = null;

    for (const { type: t, regex } of patterns) {
      match = input.slice(pos).match(regex);
      if (match) {
        type = t;
        break;
      }
    }

    if (!match) {
      throw new Error(
        `Carácter inesperado en línea ${line}, columna ${col}: ${input[pos]}`
      );
    }

    const value = match[0];

    if (type !== "WHITESPACE" && type !== "COMMENT") {
      tokens.push({ type, value, line, col });
    }

    const lines = value.split("\n");
    if (lines.length > 1) {
      line += lines.length - 1;
      col = lines[lines.length - 1].length + 1;
    } else {
      col += value.length;
    }

    pos += value.length;
  }

  console.log(`✅ Tokenización completada. ${tokens.length} tokens generados.`);
  return tokens;
}
