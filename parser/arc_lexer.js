export function lex(input) {
    return input
        .split(/\n/)
        .map(l => l.trim())
        .filter(Boolean);
}
