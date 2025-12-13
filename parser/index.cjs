// parser/index.cjs
// Entry point universal en CommonJS para el Scriptorium Arcóntico.
// - Detecta tipo de archivo .arc
// - Carga parsers ritual / kernel / genérico
// - Usa import() dinámico para ESM
// - Fallback seguro a parser_mock
// - Aplica transformKernel si está disponible

const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function tryLoad(modulePath) {
  const abs = path.resolve(__dirname, modulePath);
  try {
    // Primero intentar require (CJS)
    return require(abs);
  } catch (err1) {
    try {
      // Luego intentar import (ESM)
      return await import(pathToFileURL(abs).href);
    } catch (err2) {
      return null;
    }
  }
}

function detectTypeFromText(text) {
  const head = text.slice(0, 400).toLowerCase();
  if (/\britual\b/.test(head)) return "ritual";
  if (/\bkernel\b/.test(head)) return "kernel";
  if (/^\s*\[/.test(text)) return "sectioned";
  return "generic";
}

async function main() {
  const fileArg = process.argv[2];

  if (!fileArg) {
    console.error("❌ Uso: node parser/index.cjs <archivo.arc>");
    process.exit(1);
  }

  const absPath = path.resolve(__dirname, "..", fileArg);
  if (!fs.existsSync(absPath)) {
    console.error("❌ Archivo no encontrado:", absPath);
    process.exit(1);
  }

  console.log("⟢ ARC PARSER CJS — Booting");
  console.log("📂 Archivo:", fileArg);
  console.log("📌 Ruta absoluta:", absPath);

  const text = fs.readFileSync(absPath, "utf8");
  const kind = detectTypeFromText(text);
  console.log("🔎 Tipo detectado:", kind);

  // Cargar módulos
  const modLexer     = await tryLoad("./arc_lexer.js");
  const modAST       = await tryLoad("./arc_ast.js");
  const modKernel    = await tryLoad("./arc_kernel_parser.js");
  const modRitual    = await tryLoad("./arc_ritual_parser.js");
  const modMock      = await tryLoad("./arc_parser_mock.js");
  const modTransform = await tryLoad("./arc_transform.js");

  // Normalizar exportaciones
  const tokenize = modLexer?.tokenize || modLexer?.default?.tokenize || null;
  const parseAST = modAST?.parse || modAST?.default?.parse || null;

  const kernelParse =
    modKernel?.parseARC ||
    modKernel?.default?.parseARC ||
    null;

  const ritualParse =
    modRitual?.parseARC ||
    modRitual?.parseRitual ||
    modRitual?.default?.parseARC ||
    modRitual?.default?.parseRitual ||
    null;

  const mockParse =
    modMock?.parseARC ||
    modMock?.default?.parseARC ||
    null;

  const transform =
    modTransform?.transform ||
    modTransform?.default?.transform ||
    null;

  // ================================================
  //            RUTA DE PARSING PRINCIPAL
  // ================================================

  let rawAst = null;

  try {
    if (kind === "ritual" && ritualParse) {
      console.log("⚙️ Parser: Ritual");
      rawAst = await ritualParse(absPath);

    } else if (kind === "kernel" && kernelParse) {
      console.log("⚙️ Parser: Kernel");
      rawAst = await kernelParse(absPath);

    } else if (parseAST && tokenize) {
      console.log("⚙️ Parser: Lexer + AST");
      const tokens = tokenize(text);
      rawAst = parseAST(tokens);

    } else if (kernelParse) {
      console.log("⚙️ Parser Fallback: Kernel");
      rawAst = await kernelParse(absPath);

    } else if (mockParse) {
      console.log("⚙️ Parser Fallback: Mock");
      rawAst = await mockParse(absPath);

    } else {
      throw new Error("No hay parser disponible.");
    }

  } catch (err) {
    console.error("❌ Error durante parseo inicial:", err);
    if (mockParse) {
      console.log("🔁 Intento final: Parser Mock");
      rawAst = await mockParse(absPath);
    } else {
      process.exit(1);
    }
  }

  console.log("\n🌳 AST CRUDO:");
  console.log(JSON.stringify(rawAst, null, 2));

  // ================================================
  //                TRANSFORMACIÓN (Opcional)
  // ================================================
  let finalAst = rawAst;
  try {
    if (transform) {
      finalAst = transform(rawAst);
      console.log("\n🔁 AST TRANSFORMADO:");
      console.log(JSON.stringify(finalAst, null, 2));
    } else {
      console.log("\n⚠️ No hay transformador, se usa AST crudo.");
    }
  } catch (err) {
    console.error("\n❌ Error en transformación:", err);
  }

  console.log("\n✅ Proceso completado.");
  return finalAst;
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main().catch(err => {
    console.error("FATAL:", err);
    process.exit(1);
  });
}

module.exports = main;
