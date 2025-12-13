#stress_test
mode: dual
engine: ritual

load:
  - core/ritual.arc
  - core/ontology.arc
  - core/glosario_conciencia.arc
  - core/glosario_programacion.arc
  - core/manifesto.arc

test:
  - invoke ritual.origin
  - check ontology
  - check glossary_conciencia
  - check glossary_programacion
  - report status
