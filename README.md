# Scriptorium Arcontico

Base canonica para producir contenido hibrido (tecnico + narrativo + ritual)
con control editorial, versionado y colaboracion en GitHub.

## Estado

- Canon oficial: `SCRIPTORIUM_ARCONTICO/`
- Compatibilidad temporal: `arconte/`
- Calidad automatica: Markdown lint + link check en CI

## Rutas clave

- Canon: `SCRIPTORIUM_ARCONTICO/README.md`
- Norma genealogica: `SCRIPTORIUM_ARCONTICO/05_PROMPT_RITUAL/genealogia_ark_tkn_v1.md`
- Manifiesto oficial: `docs/architecture/ARCHITECTURE_MANIFEST_v1.0.md`
- V1/V2/V3 actuales: `arconte/` y `SCRIPTORIUM_ARCONTICO/ARCONTE_v3_tokenizado.md`
- Guia de contribucion: `CONTRIBUTING.md`

## Flujo rapido: crear nuevo texto

1. Copia `SCRIPTORIUM_ARCONTICO/_templates/plantilla_texto_ritual.md`.
2. Completa metadatos (`titulo`, `modo`, `capa`, `intencion`, `tono`, `estado`).
3. Completa bloque `TKN-I/F/T/C/M/R/S`.
4. Si defines artefacto ritual de archivo, usa extension `.arc`.
5. Guarda el archivo en la carpeta canonica correspondiente.
6. Abre PR usando la plantilla y espera CI verde.

## Calidad (CI)

![Markdown Quality](https://img.shields.io/badge/CI-markdown--quality-blue)
