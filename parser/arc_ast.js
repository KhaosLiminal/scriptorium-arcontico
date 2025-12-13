// parser/arc_ast.js
// AST parser robusto para ARC (ESM)
// - Soporta: secciones [name], bloques identificados (id { ... }),
//   asignaciones key = value, arrays [a, b, c], list-items sueltos (PATH / IDENT / STRING),
//   nested blocks (ident { ... }) y PATH tokens.
// - Tolerante: acepta token types 'EQUAL' o 'EQUALS' (según tu lexer).
// - Añade Sintaxis Deleuziana: líneas cortas dentro de blocks como `print "texto"`, `invoke obj.name`, `wait 2000`.

const escapeString = s =>
  s.replace(/^["']|["']$/g, '')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");

function expect(tokens, i, types) {
  const tk = tokens[i];
  const ok = Array.isArray(types)
    ? (tk && types.includes(tk.type))
    : (tk && tk.type === types);

  if (!ok)
    throw new Error(
      `Se esperaba ${
        Array.isArray(types) ? types.join("|") : types
      } pero se encontró ${tk ? tk.type : "EOF"} (línea ${
        tk ? tk.line : "??"
      })`
    );
}

function parseArray(tokens, i) {
  let idx = i;
  expect(tokens, idx, "LBRACK");
  idx++;
  const arr = [];

  while (
    idx < tokens.length &&
    tokens[idx].type !== "RBRACK" &&
    tokens[idx].type !== "EOF"
  ) {
    if (tokens[idx].type === "COMMA") {
      idx++;
      continue;
    }
    if (tokens[idx].type === "STRING") {
      arr.push(escapeString(tokens[idx].value));
      idx++;
      continue;
    }
    if (tokens[idx].type === "NUMBER") {
      arr.push(Number(tokens[idx].value));
      idx++;
      continue;
    }
    if (
      tokens[idx].type === "IDENT" ||
      tokens[idx].type === "PATH"
    ) {
      arr.push(tokens[idx].value.replace(/^"|"$/g, ""));
      idx++;
      continue;
    }
    idx++;
  }

  expect(tokens, idx, "RBRACK");
  return { node: arr, next: idx + 1 };
}

function parseValue(tokens, i) {
  let idx = i;
  const tk = tokens[idx];
  if (!tk)
    throw new Error(
      `Valor inesperado: fin de tokens en parseValue (idx ${i})`
    );

  if (tk.type === "STRING")
    return { node: escapeString(tk.value), next: idx + 1 };
  if (tk.type === "NUMBER")
    return { node: Number(tk.value), next: idx + 1 };
  if (tk.type === "PATH" || tk.type === "IDENT")
    return { node: tk.value, next: idx + 1 };
  if (tk.type === "LBRACK") {
    const arrres = parseArray(tokens, idx);
    return { node: arrres.node, next: arrres.next };
  }
  if (tk.type === "LBRACE") {
    const body = parseBlockBody(tokens, idx + 1);
    return {
      node: { _anon: body.nodes },
      next: body.next + 1
    };
  }

  throw new Error(
    `Valor inesperado en parseValue (tipo: ${tk.type}, linea ${tk.line})`
  );
}

function parseKeyValue(tokens, i) {
  let idx = i;
  if (!tokens[idx] || tokens[idx].type !== "IDENT")
    throw new Error(
      `Se esperaba IDENT en asignación (línea ${
        tokens[idx] ? tokens[idx].line : "??"
      })`
    );

  const key = tokens[idx].value;
  idx++;
  expect(tokens, idx, ["EQUAL", "EQUALS"]);
  idx++;

  const valRes = parseValue(tokens, idx);
  idx = valRes.next;

  return { node: { key, value: valRes.node }, next: idx };
}

function mergeItemPairs(nodes) {
  const out = [];
  for (let i = 0; i < nodes.length; i++) {
    const cur = nodes[i];
    const next = nodes[i + 1];

    if (cur.action || cur.key || cur.block) {
      out.push(cur);
      continue;
    }

    if (cur.item && next && next.item) {
      out.push({ action: cur.item, value: next.item });
      i++;
      continue;
    }

    if (cur.item) {
      out.push(cur);
      continue;
    }

    out.push(cur);
  }
  return out;
}

function parseBlockBody(tokens, idx) {
  const body = [];

  while (
    idx < tokens.length &&
    tokens[idx].type !== "RBRACE" &&
    tokens[idx].type !== "EOF"
  ) {
    if (
      tokens[idx].type === "IDENT" &&
      tokens[idx + 1] &&
      (tokens[idx + 1].type === "EQUAL" ||
        tokens[idx + 1].type === "EQUALS")
    ) {
      const kv = parseKeyValue(tokens, idx);
      body.push({ key: kv.node.key, value: kv.node.value });
      idx = kv.next;
      continue;
    }

    if (
      tokens[idx].type === "IDENT" &&
      tokens[idx + 1] &&
      tokens[idx + 1].type === "LBRACE"
    ) {
      const name = tokens[idx].value;
      idx += 2;
      const nested = parseBlockBody(tokens, idx);
      body.push({ block: name, body: nested.nodes });
      idx = nested.next;
      continue;
    }

    if (
      tokens[idx].type === "IDENT" &&
      tokens[idx + 1] &&
      ["STRING", "NUMBER", "PATH", "IDENT"].includes(
        tokens[idx + 1].type
      )
    ) {
      const actionName = tokens[idx].value;
      const paramTok = tokens[idx + 1];
      const rawVal =
        paramTok.type === "STRING"
          ? escapeString(paramTok.value)
          : paramTok.value;
      body.push({ action: actionName, value: rawVal });
      idx += 2;
      continue;
    }

    if (tokens[idx].type === "PATH" || tokens[idx].type === "STRING") {
      body.push({
        item: tokens[idx].value.replace(/^"|"$/g, "")
      });
      idx++;
      continue;
    }

    if (tokens[idx].type === "IDENT") {
      body.push({ item: tokens[idx].value });
      idx++;
      continue;
    }

    idx++;
  }

  const merged = mergeItemPairs(body);

  return { nodes: merged, next: idx };
}

function isActionName(name) {
  return ["print", "invoke", "log", "wait", "emit"].includes(name);
}

function convertBlockToAction(blockNode) {
  if (!blockNode) return null;

  if (blockNode.action) {
    const name = blockNode.action;
    const raw = blockNode.value;
    if (!isActionName(name)) return null;

    switch (name) {
      case "print":
        return { print: { text: raw } };
      case "log":
        return { log: { text: raw } };
      case "invoke":
        return { invoke: { name: raw } };
      case "emit":
        return { emit: { event: raw } };
      case "wait":
        return { wait: { ms: Number(raw) } };
      default:
        return null;
    }
  }

  if (blockNode.block) {
    if (!isActionName(blockNode.block)) return null;
    const params = {};
    for (const node of blockNode.body || []) {
      if (node.key) params[node.key] = node.value;
    }

    if (blockNode.block === "print") return { print: params };
    if (blockNode.block === "log") return { log: params };
    if (blockNode.block === "invoke") return { invoke: params };
    if (blockNode.block === "emit") return { emit: params };
    if (blockNode.block === "wait") return { wait: params };
  }

  return null;
}

function convertBlockToStep(rawBlock) {
  if (!rawBlock || rawBlock.type !== "block") return null;

  let stepName = null;
  if (rawBlock.name && rawBlock.name.startsWith("step ")) {
    stepName = rawBlock.name.split(" ")[1];
  } else {
    return null;
  }

  const actions = [];

  for (const entry of rawBlock.body || []) {
    if (entry.block && isActionName(entry.block)) {
      const act = convertBlockToAction(entry);
      if (act) actions.push(act);
      continue;
    }

    if (entry.action) {
      const act = convertBlockToAction(entry);
      if (act) actions.push(act);
      continue;
    }
  }

  return { type: "step", name: stepName, actions };
}

export function parse(tokens) {
  let idx = 0;
  const ast = { type: "document", sections: [] };

  while (idx < tokens.length && tokens[idx].type !== "EOF") {
    const tk = tokens[idx];

    if (tk.type === "LBRACK" || tk.type === "LBRACKET") {
      idx++;
      expect(tokens, idx, "IDENT");
      const name = tokens[idx].value;
      idx++;
      expect(tokens, idx, ["RBRACK", "RBRACKET"]);
      idx++;

      const section = {
        type: "section",
        name,
        entries: []
      };

      while (
        idx < tokens.length &&
        tokens[idx].type !== "LBRACK" &&
        tokens[idx].type !== "LBRACKET" &&
        tokens[idx].type !== "EOF"
      ) {
        if (
          tokens[idx].type === "IDENT" &&
          tokens[idx + 1] &&
          (tokens[idx + 1].type === "EQUAL" ||
            tokens[idx + 1].type === "EQUALS")
        ) {
          const kv = parseKeyValue(tokens, idx);
          section.entries.push(kv.node);
          idx = kv.next;
          continue;
        }

        if (
          tokens[idx].type === "IDENT" &&
          tokens[idx + 1] &&
          tokens[idx + 1].type === "LBRACE"
        ) {
          const nameBlock = tokens[idx].value;
          idx += 2;
          const body = parseBlockBody(tokens, idx);
          section.entries.push({
            block: nameBlock,
            body: body.nodes
          });
          idx = body.next;
          if (tokens[idx] && tokens[idx].type === "RBRACE") idx++;
          continue;
        }

        idx++;
      }

      ast.sections.push(section);
      continue;
    }

    if (tk.type === "IDENT") {
      const firstIdent = tk.value;
      idx++;

      if (
        tokens[idx] &&
        tokens[idx].type === "IDENT" &&
        tokens[idx + 1] &&
        tokens[idx + 1].type === "LBRACE"
      ) {
        const secondIdent = tokens[idx].value;
        idx += 2;

        const body = parseBlockBody(tokens, idx);
        const rawBlock = {
          type: "block",
          name: `${firstIdent} ${secondIdent}`,
          body: body.nodes
        };

        const step = convertBlockToStep(rawBlock);
        if (step) ast.sections.push(step);
        else ast.sections.push(rawBlock);

        idx = body.next;
        if (tokens[idx] && tokens[idx].type === "RBRACE") idx++;
        continue;
      }

      const nameParts = [firstIdent];
      while (tokens[idx] && tokens[idx].type === "DOT") {
        idx++;
        expect(tokens, idx, "IDENT");
        nameParts.push(tokens[idx].value);
        idx++;
      }

      if (tokens[idx] && tokens[idx].type === "LBRACE") {
        idx++;
        const body = parseBlockBody(tokens, idx);
        const rawBlock = {
          type: "block",
          name: nameParts.join("."),
          body: body.nodes
        };

        ast.sections.push(rawBlock);

        idx = body.next;
        if (tokens[idx] && tokens[idx].type === "RBRACE") idx++;
        continue;
      }

      continue;
    }

    idx++;
  }

  return ast;
}

export default parse;
