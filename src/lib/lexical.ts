import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// Payload's generated richText types carry an index signature that
// SerializedEditorState lacks, so include it for assignability.
type LexicalState = SerializedEditorState & { [k: string]: unknown }

// Wrap a plain string into a minimal valid Lexical editor state (one paragraph).
// Used to seed richText fields and to convert legacy textarea values.
export function textToLexical(text: string): LexicalState {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          children: [
            {
              type: 'text',
              text,
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              version: 1,
            },
          ],
        },
      ],
    },
  } as unknown as LexicalState
}

// Multi-paragraph plain text -> one Lexical paragraph per blank-line block.
export function paragraphsToLexical(text: string): LexicalState {
  const blocks = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  const state = textToLexical(blocks[0] ?? '')
  state.root.children = blocks.map((block) => textToLexical(block).root.children[0])
  return state
}
