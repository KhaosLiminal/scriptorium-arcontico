import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const EDGE_TTS = `"C:\\Users\\alien\\AppData\\Roaming\\Python\\Python314\\Scripts\\edge-tts.exe"`;

export function processVoices(timeline, outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const assets = [];
    const subtitles = [];

    timeline
        .filter(e => e.kind === "voice")
        .forEach((event, i) => {

            const audioPath = path.join(outputDir, `voice_${i}.wav`);

            execSync(
                `${EDGE_TTS} --voice ${event.voice} --text "${event.text}" --write-media "${audioPath}"`,
                { stdio: "ignore" }
            );

            const duration = Math.max(2, event.text.split(" ").length * 0.45);

            // AUDIO
            assets.push({
                type: "audio",
                src: audioPath,
                start: event.start,
                duration
            });

            // SUBTÍTULO
            subtitles.push({
                type: "clip",
                clipType: "subtitle",
                value: event.text,
                start: event.start,
                duration,
                layer: event.layer ?? 3
            });
        });

    return { assets, subtitles };
}
