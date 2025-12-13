// test.js
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("✅ Node.js está funcionando correctamente");
console.log("Versión de Node.js:", process.version);
console.log("Plataforma:", process.platform);
console.log("Directorio actual:", process.cwd());

// Prueba de lectura de archivo
try {
    const files = readdirSync('.');
    console.log("\n📁 Archivos en el directorio actual:");
    console.log(files.join('\n'));
} catch (err) {
    console.error("Error al leer el directorio:", err.message);
}