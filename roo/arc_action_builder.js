export function buildActions(body, ritualProfile) {
  const actions = [];

  actions.push({
    type: "emit_text",
    args: {
      text: body,
      voice: ritualProfile.voice
    }
  });

  if (ritualProfile.pacing === "lento") {
    actions.push({
      type: "wait",
      args: { ms: 4000 }
    });
  }

  return actions;
}
