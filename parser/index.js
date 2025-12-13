// parser/index.js (ESM)
// Entry point unificado para el parser ARC.
// - Detecta tipo de archivo (.arc) y enruta al parser correcto.
// - Integra lexer (si está disponible), AST parser y transformador.
// - Tolerante a módulos CommonJS/ESM mediante import() dinámico.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function tryImport(relPath) {
  const full = path.resolve(__dirname, relPath);
  try {
    return await import(full);
  } catch (err) {
    // Try require-like fallback via dynamic import of file://
    try {
      return await import("file://" + full);
    } catch (err2) {
      // give up
      return null;
    }
  }
}

function detectTypeFromText(text) {
  const head = text.slice(0, 400).toLowerCase();

  // heuristics
  if (/\britual\b/.test(head)) return "ritual";
  if (/\bkernel\b/.test(head)) return "kernel";
  if (/^\s*\[/.test(text)) return "sectioned"; // like [name] style
  return "generic";
}

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error("❌ Uso: node parser/index.js <ruta/al/archivo.arc>");
    process.exit(1);
  }

  const absPath = path.resolve(__dirname, "..", fileArg);
  if (!fs.existsSync(absPath)) {
    console.error("❌ Archivo no encontrado:", absPath);
    process.exit(1);
  }

  console.log("⟢ ARC PARSER — Booting");
  console.log("📂 Archivo solicitado:", fileArg);
  console.log("📌 Ruta absoluta:", absPath);

  const text = fs.readFileSync(absPath, "utf8");
  const kind = detectTypeFromText(text);
  console.log("🔎 Tipo detectado (heurístico):", kind);

  // Try to dynamically import modules (may be CommonJS or ESM)
  const modLexer = await tryImport("./arc_lexer.js");            // ESM preferred
  const modAST   = await tryImport("./arc_ast.js");
  const modKernel = await tryImport("./arc_kernel_parser.js");
  const modRitual = await tryImport("./arc_ritual_parser.js");
  const modMock   = await tryImport("./arc_parser_mock.js");
  const modTransform = await tryImport("./arc_transform.js");

  // Normalize imported modules to functions we can call regardless of export style
  const lexerTokenize = (modLexer && (modLexer.tokenize || modLexer.default?.tokenize || modLexer.default)) ? (modLexer.tokenize || modLexer.default?.tokenize || modLexer.default) : null;
  const astParse = (modAST && (modAST.parse || modAST.default?.parse || modAST.default)) ? (modAST.parse || modAST.default?.parse || modAST.default) : null;
  const kernelParse = (modKernel && (modKernel.parseARC || modKernel.default?.parseARC || modKernel.default)) ? (modKernel.parseARC || modKernel.default?.parseARC || modKernel.default) : null;
  const ritualParse = (modRitual && (modRitual.parseRitual || modRitual.parseARC || modRitual.default?.parseRitual || modRitual.default)) ? (modRitual.parseRitual || modRitual.parseARC || modRitual.default?.parseRitual || modRitual.default) : null;
  const mockParse = (modMock && (modMock.parseARC || modMock.mockParseARC || modMock.default?.parseARC || modMock.default)) ? (modMock.parseARC || modMock.mockParseARC || modMock.default?.parseARC || modMock.default) : null;
  const transform = (modTransform && (modTransform.transform || modTransform.default?.transform || modTransform.default)) ? (modTransform.transform || modTransform.default?.transform || modTransform.default) : null;

  let rawAst = null;
  try {
    if (kind === "ritual" && ritualParse) {
      console.log("⚙️ Usando ritual parser (arc_ritual_parser).");
      rawAst = await ritualParse(absPath);
    } else if (kind === "kernel" && kernelParse) {
      console.log("⚙️ Usando kernel parser (arc_kernel_parser).");
      rawAst = await kernelParse.parseARC ? await kernelParse.parseARC(absPath) : await kernelParse(absPath);
    } else if (astParse && lexerTokenize) {
      console.log("⚙️ Usando lexer + arc_ast pipeline (general).");
      const tokens = lexerTokenize(text);
      rawAst = astParse(tokens);
    } else if (kernelParse) {
      // fallback: try kernel parse
      console.log("⚙️ Fallback a kernel parser.");
      rawAst = await kernelParse.parseARC ? await kernelParse.parseARC(absPath) : await kernelParse(absPath);
    } else if (mockParse) {
      console.log("⚙️ Fallback a parser mock.");
      rawAst = await mockParse(absPath);
    } else {
      throw new Error("No se encontró parser disponible.");
    }
  } catch (err) {
    console.error("❌ Error durante parseo:", err);
    // Try mock as last resort
    if (mockParse) {
      console.log("🔁 Intentando parser mock como último recurso.");
      rawAst = await mockParse(absPath);
    } else {
      process.exit(1);
    }
  }

  console.log("\n🌳 AST CRUDO:");
  console.log(JSON.stringify(rawAst, null, 2));

  // Transform AST toward kernel/ritual normalized shapes if possible
  let norm = rawAst;
  try {
    if (transform) {
      norm = transform(rawAst);
      console.log("\n🔁 AST TRANSFORMADO:");
      console.log(JSON.stringify(norm, null, 2));
    } else {
      console.log("\n⚠️ No se encontró transformador; dejando AST crudo.");
    }
  } catch (err) {
    console.error("\n❌ Error en transformación:", err);
  }

  console.log("\n✅ Proceso completado.");
  return norm;
}

// Run if invoked directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith("index.js")) {
  main().catch(err => {
    console.error("FATAL:", err);
    process.exit(1);
  });
}

export default main;
