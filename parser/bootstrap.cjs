// parser/bootstrap.cjs
// ========================================================
//   ✦  BOOTSTRAP RITUALÍSTICO HÍBRIDO — CJS PURO  ✦
//
//   Compatible con Node 18–24+
//   Sin sintaxis ESM, sin import, sin sorpresas.
//   Selecciona automáticamente index.cjs o index.js,
//   ejecuta ESM mediante un proceso hijo controlado,
//   y no rompe jamás el entorno.
//
// ========================================================

const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// --------------------------------------------------------
// UMBRAL 0 — ARGUMENTO DEL RITUAL
// --------------------------------------------------------
const fileArg = process.argv[2];

if (!fileArg) {
  console.log("\n⟢ ✦ UMBRAL DEL ARCÓNTE ✦");
  console.log("   Debes entregar un archivo .arc al umbral.\n");
  console.log("   → Uso:");
  console.log("     node parser/bootstrap.cjs rituales/ritual.origin.arc\n");
  process.exit(1);
}

// --------------------------------------------------------
// UMBRAL 1 — DETECCIÓN DEL ENTORNO
// Sin usar 'import', porque Node 24 lo interpreta como ESM.
// --------------------------------------------------------
function isPackageTypeModule() {
  const pkg = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(pkg)) return false;

  const j = JSON.parse(fs.readFileSync(pkg, "utf8"));
  return j.type === "module";
}

const isESM = isPackageTypeModule(); // modo seguro

console.log("\n⎇ MODO BOOTSTRAP — SCRIPTORIUM ARCÓNTICO");
console.log("   Observando el tejido del entorno…");
console.log(`   → ESM (por package.json): ${isESM ? "Sí" : "No"}`);
console.log("-------------------------------------------------\n");

// --------------------------------------------------------
// UMBRAL 2 — RUTAS INTERNAS
// --------------------------------------------------------
const baseDir = __dirname;
const entryCJS = path.resolve(baseDir, "index.cjs");
const entryESM = path.resolve(baseDir, "index.js");

console.log("⟢ Preparando la cámara del parser…");
console.log(`   → Archivo solicitado: ${fileArg}\n`);

// --------------------------------------------------------
// UMBRAL 3 — EJECUCIÓN SEGÚN ENTORNO
// --------------------------------------------------------

// MODO 1 — Ejecutar en CommonJS puro
if (!isESM) {
  console.log("✦ Ritual detectado: Entorno CommonJS");
  console.log("  Invocando guardián index.cjs…\n");

  try {
    const run = require(entryCJS);
    run(fileArg);
    console.log("\n⟢ Ritual completado en CJS ✦\n");
  } catch (err) {
    console.error("\n❌ Error durante el ritual CJS:");
    console.error(err);
  }
  process.exit(0);
}

// MODO 2 — Ejecutar en entorno ESM, usando proceso hijo
console.log("✦ Ritual detectado: Entorno ESM");
console.log("  Convocando intérprete index.js mediante child_process…\n");

try {
  execFileSync("node", [entryESM, fileArg], { stdio: "inherit" });
  console.log("\n⟢ Ritual completado en ESM ✦\n");
} catch (err) {
  console.error("\n❌ Error durante el ritual ESM:");
  console.error(err);
}

process.exit(0);
