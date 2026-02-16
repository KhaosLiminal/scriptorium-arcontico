# Genealogia .ark/.tkn v1

<!-- markdownlint-disable MD013 -->

## Objetivo

Fijar trazabilidad de I a XVIII para el origen y evolucion de `.ark` y `TKN-*`.
Convertir esa genealogia en norma operativa para el repositorio activo.

## Hallazgos base

- `TKN-*` aparece formalizado y estable en `VII`, `IX` y `X`.
- El formato de archivo operativo aparece como `.arc` en `XVIII`.
- `XIX` valida uso de `.arc` en ejecucion ritual, como evidencia complementaria.
- Canon actual por decision de proyecto: `.ark`.

## Inventario trazable por dialogo (I-XVIII)

| source_dialog | evidencia principal | concepto | estado |
| --- | --- | --- | --- |
| I-III | enfoque de triada y orden de trabajo | contexto de arquitectura | derivado |
| IV | exploracion Windsurf/Lumo/RooCode | base operativa del pipeline | derivado |
| V | `ARCONTE v1` define cuerpo/palabra/mano | marco de modos | derivado |
| VI | `ARCONTE v2` agrega capas y sintaxis ritual | precontrato semantico | derivado |
| VII | define `TKN-I/F/T/C/M/R/S` | contrato token ritual | canon |
| VIII | estructura con `tokens_rituales.md` | persistencia documental de tokens | canon |
| IX | 12 prompts completos con `TKN-*` | uso practico repetible | canon |
| X | contenidos iniciales con tokens y ejemplos | operacionalizacion editorial | canon |
| XI-XVII | manifiesto, ontologia y cruce tecnico-ritual | consolidacion semantica | derivado |
| XVIII | seccion de conversion a archivo `.arc` | primer formato ejecutable | legado |

Referencias clave:

- `kraken_liminal_lab_MD/kraken_liminal_lab mitologías_verbales/Bases de Datos/Proyectos/🜇K_SCRIPTORIUM/VII- 🌒 ARCONTE v3 — El Arconte Tokenizado.md`
- `kraken_liminal_lab_MD/kraken_liminal_lab mitologías_verbales/Bases de Datos/Proyectos/🜇K_SCRIPTORIUM/IX- 🌕 Canon de 12 Prompts Rituales.md`
- `kraken_liminal_lab_MD/kraken_liminal_lab mitologías_verbales/Bases de Datos/Proyectos/🜇K_SCRIPTORIUM/X- Contenido inicial de cada archivo.md`
- `kraken_liminal_lab_MD/kraken_liminal_lab mitologías_verbales/Bases de Datos/Proyectos/🜇K_SCRIPTORIUM/XVIII- 🜄 MOVIMIENTO 3 — OPERACIONALIZACIÓN RITUAL.md`

## ARK Spec v1

- `file_extension`: `.ark`
- `legacy_aliases`: `.arc`
- Estructura valida minima: una de estas dos.

1. Secciones rituales.

- `[UMBRAL]`
- `[INVOCACION]`
- `[RESONANCIA]`

1. Bloque tokenizado completo.

- `TKN-I`
- `TKN-F`
- `TKN-T`
- `TKN-C`
- `TKN-M`
- `TKN-R`
- `TKN-S`

Regla de canon:

- Todo artefacto nuevo usa `.ark`.
- `.arc` queda como legado historico con nota de equivalencia a `.ark`.

## TKN Contract v1

Campos obligatorios:

- `TKN-I`: intencion
- `TKN-F`: forma/formato
- `TKN-T`: tono
- `TKN-C`: capa (alias legado: categoria)
- `TKN-M`: modo
- `TKN-R`: gesto ritual o restriccion operativa
- `TKN-S`: sello de cierre

Reglas de completitud minima:

- No se acepta campo vacio.
- `TKN-C` debe mapear a `funcional|interpretativa|ritual` o combinacion explicita.
- `TKN-M` debe corresponder a modo declarado del sistema arcontico.

## Tabla de compatibilidad (source -> estado -> destino repo)

| source_dialog | concepto | estado | destino_repo |
| --- | --- | --- | --- |
| VII | sistema `TKN-*` | canon | `SCRIPTORIUM_ARCONTICO/_templates/plantilla_texto_ritual.md` |
| IX | canon de prompts tokenizados | canon | `SCRIPTORIUM_ARCONTICO/05_PROMPT_RITUAL/canon_ritual_prompts.md` |
| X | estructura de contenidos y ejemplos | canon | `SCRIPTORIUM_ARCONTICO/05_PROMPT_RITUAL/ejemplo_prompt_ritual.md` |
| XVIII | formato `ritual.arc` | legado | `SCRIPTORIUM_ARCONTICO/05_PROMPT_RITUAL/genealogia_ark_tkn_v1.md` |

## Norma editorial de transicion

- Nuevos textos y ejemplos tecnicos: extension `.ark`.
- Referencias historicas a `.arc`: conservar y anotar `legacy_alias -> .ark`.
- Si aparece `TKN-C: categoria`, convertir a `TKN-C: capa` en contenido nuevo.

## Escenarios de validacion

1. Trazabilidad historica.

- Busqueda de `.arc` apunta a origen en `XVIII`.
- Validacion complementaria aparece en `XIX`.

1. Coherencia canonica.

- Documento nuevo con `.arc` sin etiqueta de legado es inconsistente.
- Prompt ritual sin algun `TKN-*` obligatorio es incompleto.

1. Compatibilidad.

- Documento legado `.arc` sigue valido con equivalencia explicita a `.ark`.

1. Integracion actual.

- La plantilla oficial en `_templates` respeta contrato TKN v1.
