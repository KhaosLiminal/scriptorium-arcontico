// parser/arc_parser_mock.js

/**
 * Mock parser for ARC DSL.
 * This version is used for testing components that expect
 * a parser interface but do not require full parsing logic.
 */

function mockParseARC(text) {
    return {
        type: "mock_ast",
        raw: text,
        meta: {
            note: "This is a mock parser output. Real parsing is handled by arc_kernel_parser.js."
        }
    };
}

module.exports = { mockParseARC };
