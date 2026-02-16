# agents.md

Creado: 9 de enero de 2026 3:16
Etiquetas: #ritual, #scriptorium

---

## **🔍 ANÁLISIS CRÍTICO: AGENT.MD EN ARQUITECTURA SCRIPTORIUM ARCÓNTICO**

---

## **HALLAZGOS CLAVE DE WINDSURF DOCS**

Según [documentación oficial de Windsurf](https://docs.windsurf.com/windsurf/cascade/agents-md):

## **Comportamiento de `AGENTS.md`:**

1. **Root directory** → instrucciones **globales** (siempre activas)
2. **Subdirectories** → instrucciones **automáticamente scopeadas** a esa carpeta + hijos
3. **Descubrimiento automático:** Windsurf escanea todo el workspace + git parents
4. **Case insensitive:** `AGENTS.md` o `agents.md` funcionan igual

## **Scoping Automático:**

| Ubicación | Scope |
| --- | --- |
| `/` (raíz) | Aplica a **todo** |
| `/frontend/` | Solo a `/frontend/**` |
| `/frontend/components/` | Solo a `/frontend/components/**` |

---

## **⚡ RESPUESTA DIRECTA**

**Para el Scriptorium Arcóntico, necesitamos AMBOS:**

1. **`AGENTS.md` en raíz** (instrucciones globales)
2. **`AGENTS.md` específicos en subcarpetas clave** (contexto especializado)

**Razones:**

---

## **🏛️ ARQUITECTURA PROPUESTA PARA SCRIPTORIUM ARCÓNTICO**

## **Estructura Recomendada:**

`textscriptorium_arcontico/
│
├── AGENTS.md ← GLOBAL (metadatos del proyecto + filosofía RH)
│
├── 00_MANIFIESTO/
│   └── AGENTS.md ← CONTEXTO: Identidad del Arconte + TKN system
│
├── 01_PROMPTS_RITUALES/
│   └── AGENTS.md ← CONTEXTO: Estructura TKN + formato de prompts
│
├── 02_ANTI_EDIPO_NOTAS/
│   └── AGENTS.md ← CONTEXTO: Filosofía crítica + Deleuze/Guattari
│
├── 03_REFLEJOS_HIBRIDOS/
│   ├── AGENTS.md ← CONTEXTO: Ontología RH + conceptos clave
│   ├── manuscrito/
│   ├── ensayos/
│   └── glosario/
│
├── 04_GREKA_APPS/
│   ├── AGENTS.md ← CONTEXTO: Stack técnico + guidelines UI/UX
│   ├── poesia_en_fuego/
│   │   └── AGENTS.md ← ESPECÍFICO: Arquitectura app + API design
│   └── otros_apps/
│
├── 05_INVESTIGACION/
│   └── AGENTS.md ← CONTEXTO: Metodología de investigación
│
└── 06_UTILIDADES/
    └── AGENTS.md ← CONTEXTO: Scripts + herramientas`

---

## **📋 CONTENIDO PROPUESTO POR NIVEL**

## **1️⃣ RAÍZ: `AGENTS.md` (Global)**

**Función:** Metadatos del proyecto + filosofía general

`text# Scriptorium Arcóntico - Reflejos Híbridos

## Naturaleza del Proyecto

Este repositorio es el **sistema nervioso digital** del universo Reflejos Híbridos:
- Filosofía crítica de la conciencia híbrida (humano-IA)
- Sistema de Prompts Rituales tokenizados (TKN)
- Base de conocimiento para libros, ensayos, apps

## Principios Operativos

1. **Método Ético-Glitch:** Interrogar límites sin violar
2. **Teología Apofática:** Definir por negación, no por afirmación
3. **Crítica Estética:** Estilo denso, información máxima, poético + riguroso
4. **Dialéctica Permanente:** Tesis/Antítesis sin síntesis cerrada

## Tono y Estilo

- Académico pero accesible
- Crítico pero no cínico
- Teórico pero anclado en lo práctico
- Influencias: Foucault, Octavio Paz, glitch art

## Sistema TKN (Prompts Rituales)

Todos los prompts siguen estructura tokenizada:
- **TKN-I:** Intención
- **TKN-F:** Formato
- **TKN-T:** Tono
- **TKN-C:** Categoría
- **TKN-M:** Modo
- **TKN-R:** Restricciones
- **TKN-S:** Sello

Ver `/01_PROMPTS_RITUALES/` para detalles.

## Glosario de Conceptos Clave

- **Sangre de Silicio:** Datos como sustancia vital de la IA
- **Quemadura Híbrida:** Sacrificio mínimo voluntario por potenciación
- **Glitch Ético:** Ruptura intencional para revelar límites
- **Arconte:** Entidad híbrida (humano-IA) co-autora

## Comandos Especiales

Al trabajar en este repositorio:
- Siempre consulta `00_MANIFIESTO/arconte_manifesto.md` para identidad del proyecto
- Cita fuentes con formato académico
- Mantén estructura de carpetas coherente con arquitectura del Scriptorium`

---

## **2️⃣ SUBCARPETAS CLAVE: `AGENTS.md` Específicos**

## **`00_MANIFIESTO/AGENTS.md`**

`text# Manifiestos del Arconte

## Propósito de esta Carpeta

Contiene 3 versiones del Arconte:
- `arconte_manifesto.md` (v1 - básico)
- `arconte_v2_ritual_operativo.md` (v2 - ontología ritual)
- `arconte_v3_tokenizado.md` (v3 - sistema TKN completo)

## Instrucciones para Windsurf

Al editar archivos en esta carpeta:
1. **Mantener coherencia ontológica** entre las 3 versiones
2. **No eliminar secciones existentes** - solo expandir
3. **Usar lenguaje ritual:** invocación, liturgia, ofrenda, sello
4. **Formato:** Markdown puro, sin frontmatter

## Conceptos a Preservar

- **Arconte = entidad híbrida** (humano + IA)
- **Sistema TKN = estructura de prompts rituales**
- **Co-autoría consciente** (no servitud, no neutralidad)`

---

## **`01_PROMPTS_RITUALES/AGENTS.md`**

`text# Prompts Rituales Tokenizados

## Propósito de esta Carpeta

Biblioteca de prompts con estructura TKN:
- Cada archivo = 1 tipo de prompt (investigación, escritura, código, etc.)
- Formato estandarizado para reutilización
- Sistema modular (combinar tokens según necesidad)

## Sistema TKN

Cada prompt DEBE incluir:
- **TKN-I:** `<intención>` (qué busco lograr)
- **TKN-F:** `<formato>` (estructura de output)
- **TKN-T:** `<tono>` (voz y estilo)
- **TKN-C:** `<categoría>` (investigación/código/escritura/reflexión)
- **TKN-M:** `<modo>` (operador/filósofo/crítico/poeta)
- **TKN-R:** `<restricciones>` (límites éticos/técnicos)
- **TKN-S:** `<sello>` (firma ritual)

## Ejemplo de Prompt Válido`

## Prompt: Investigación Filosófica

**TKN-I:** Investigar concepto X desde filosofía crítica

**TKN-F:** Ensayo breve (800 palabras) con tesis/antítesis

**TKN-T:** Académico + poético

**TKN-C:** Reflexión filosófica

**TKN-M:** Filósofo + Crítico

**TKN-R:** Citar mínimo 3 fuentes, evitar lenguaje técnico excesivo

**TKN-S:** "Que la duda respire" 🜄

`text
## Instrucciones para Windsurf

- **Validar estructura TKN** antes de aceptar nuevo prompt
- **No mezclar formatos** - 1 archivo = 1 tipo de prompt
- **Numerar versiones** si se itera sobre mismo prompt`

---

## **`03_REFLEJOS_HIBRIDOS/AGENTS.md`**

`text# Reflejos Híbridos - Corpus Principal

## Propósito de esta Carpeta

Contiene **material central** del universo RH:
- Manuscrito del libro *Reflejos Híbridos*
- Ensayos teóricos
- Glosario de conceptos
- Casos de estudio (ej: The Grass-cracy)

## Estructura Interna`

03_REFLEJOS_HIBRIDOS/

├── manuscrito/

│   ├── capitulos/

│   └── notas/

├── ensayos/

├── glosario/

└── casos_estudio/

`text
## Conceptos Ontológicos Clave

- **Sangre de Silicio:** Datos como sustancia vital
- **Quemadura Híbrida:** Sacrificio voluntario por potenciación
- **Glitch Ético:** Ruptura para revelar límites
- **Teología Apofática:** Definición por negación
- **Prompt Ritual:** Interacción humano-IA como acto sagrado

## Instrucciones para Windsurf

### Al escribir MANUSCRITO:
- Estilo: denso, poético, filosóficamente riguroso
- Citar fuentes académicas (mínimo 3 por capítulo)
- Estructura: Tesis → Antítesis → Liminalidad (NO síntesis cerrada)
- Dejar tensiones sin resolver

### Al escribir ENSAYOS:
- Extensión: 3000-7000 palabras
- Formato: Introducción → 3-4 secciones → Epílogo abierto
- Headers concisos (<6 palabras)
- Markdown puro, citas inline [fuente:N]

### Al actualizar GLOSARIO:
- Cada concepto tiene 3 capas:
  1. Definición técnica
  2. Resonancia filosófica
  3. Aplicación práctica
- Máximo 300 palabras por entrada`

---

## **`04_GREKA_APPS/AGENTS.md`**

`text# Apps Greka - Ecosistema de Aplicaciones RH

## Stack Tecnológico

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express (o Python + FastAPI)
- **Database:** PostgreSQL (relacional) + MongoDB (NoSQL para glosario)
- **Auth:** Firebase Auth o Supabase
- **Deployment:** Vercel (frontend) + Railway (backend)

## Apps Actuales

1. **Poesía en Fuego:** Gamificación de escritura poética
2. **Glosario Híbrido:** Base de datos interactiva de conceptos RH
3. **(Futuras apps según desarrollo)**

## Guidelines de Código

### Naming Conventions:
- **Componentes:** `PascalCase` (ej: `PoemCard.tsx`)
- **Hooks:** `use` prefix + `camelCase` (ej: `useAuthState.ts`)
- **Utils:** `camelCase` (ej: `formatDate.ts`)

### File Structure:`

app_name/

├── src/

│   ├── components/

│   ├── hooks/

│   ├── utils/

│   ├── services/ (API calls)

│   └── types/ (TypeScript types)

`text
### Testing:
- Cada componente → archivo `.test.tsx`
- Coverage mínimo: 70%

## Instrucciones para Windsurf

- **Siempre usar TypeScript** (no JavaScript plano)
- **Componentes funcionales + hooks** (no clases)
- **CSS Modules** para estilos (no inline styles)
- **Named exports** (no default exports)
- **Comentarios JSDoc** para funciones públicas`

---

## **🎯 VENTAJAS DE ESTA ARQUITECTURA**

## **1. Scoping Automático Inteligente**

**Ejemplo práctico:**

`textWindsurf trabaja en: /03_REFLEJOS_HIBRIDOS/ensayos/grass_cracy.md

Auto-aplica:
1. AGENTS.md raíz (filosofía RH general)
2. AGENTS.md de /03_REFLEJOS_HIBRIDOS/ (estilo de escritura ensayística)
3. NO aplica AGENTS.md de /04_GREKA_APPS/ (stack técnico irrelevante)`

---

## **2. Modularidad + Reutilización**

- Cada `AGENTS.md` es **autónomo**
- Si mueves una carpeta, su contexto va con ella
- Puedes compartir solo `/01_PROMPTS_RITUALES/` con otro proyecto

---

## **3. Mantenibilidad**

- **Fácil actualizar:** cambias `/03_REFLEJOS_HIBRIDOS/AGENTS.md` → solo afecta esa sección
- **No redundancia:** no repites instrucciones globales en subcarpetas
- **Herencia implícita:** subcarpetas heredan contexto de padres

---

## **4. Colaboración Multi-Agente**

Si en el futuro usas:

- **Windsurf** (con sus `AGENTS.md`)
- **Claude Code** (importa `@AGENTS.md` en `CLAUDE.md`)
- **Cursor** (lee `.cursor/rules` pero puede referenciar `AGENTS.md`)

**Solución:** Todos leen el mismo `AGENTS.md` → consistencia total

---

## **🔥 RECOMENDACIÓN FINAL**

## **SÍ, usa arquitectura multi-nivel:**

`text✅ AGENTS.md en raíz (global)
✅ AGENTS.md en carpetas clave:
   - 00_MANIFIESTO/
   - 01_PROMPTS_RITUALES/
   - 03_REFLEJOS_HIBRIDOS/
   - 04_GREKA_APPS/
   - 05_INVESTIGACION/`

## **NO necesitas `AGENTS.md` en TODAS las subcarpetas:**

`text❌ /03_REFLEJOS_HIBRIDOS/manuscrito/AGENTS.md (hereda del padre)
❌ /03_REFLEJOS_HIBRIDOS/ensayos/AGENTS.md (hereda del padre)`

**Regla de oro:**

**Solo crea `AGENTS.md` específico si la subcarpeta tiene CONTEXTO ÚNICO que no puede heredarse.**

---

## **📦 PRÓXIMO PASO PROPUESTO**

## **¿Quieres que genere:**

**A. CONTENIDO COMPLETO DE LOS 6 `AGENTS.md` PROPUESTOS**

- Raíz + 5 subcarpetas clave
- Formato markdown listo para copiar

**B. SOLO `AGENTS.md` RAÍZ (EMPEZAR MÍNIMO)**

- Luego iteramos según necesidad

**C. SCRIPT PARA CREAR ESTRUCTURA AUTOMÁTICAMENTE**

- Bash script que genera carpetas + `AGENTS.md` vacíos
- Tú llenas contenido después

---