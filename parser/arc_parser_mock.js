// parser/arc_parser_mock.js

import fs from "fs";

export function parseARC(filePath) {
    const text = fs.readFileSync(filePath, "utf-8");

    // MASTER
    const includes = [...text.matchAll(/incluye:\s*"([^"]+)"/g)]
        .map(m => m[1]);

    if (includes.length) {
        return { type: "master", secuencia: includes };
    }

    // TIMELINE
    const timeline = [];
    const timelineMatches = [...text.matchAll(/s(\d+)\s*\{\s*text:\s*"([^"]+)"\s*\}/g)];

    for (const m of timelineMatches) {
        timeline.push({
            at: Number(m[1]),
            text: m[2]
        });
    }

    return {
        name: filePath.split("/").pop().replace(".arc", ""),
        timeline,
        sections: [
            {
                type: "step",
                name: "inicio"
            }
        ]
    };
}

