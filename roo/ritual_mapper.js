export function mapRitual(tokens) {
  return {
    pacing: tokens["TKN-R"] === "silencio" ? "lento" : "normal",
    voice: tokens["TKN-M"]?.includes("Ritual") ? "susurrada" : "neutral",
    emphasis: tokens["TKN-T"] ?? "neutro",
    layer: tokens["TKN-C"]
  };
}
