import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_CODE_BLOCK,
  ELEMENT_PARAGRAPH,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MARK_STRIKETHROUGH,
  MARK_CODE,
  ELEMENT_CODE_LINE,
  ELEMENT_BLOCKQUOTE,
} from "@udecode/plate";

const ELEMENT_TAG = "tag";

// @ts-ignore
const createElement = (text: string, { type = ELEMENT_PARAGRAPH, mark, ...props }: any = {}) => {
  const leaf = { text };
  if (mark) {
    // @ts-ignore
    leaf[mark] = true;
  }

  return {
    type,
    ...props,
    children: [leaf],
  };
};

export const initialEditorValue = [
  createElement("🧱 Elementssss", {
    type: ELEMENT_H1,
    children: [createElement("🧱 Elements XXXXXXXXXXX", { type: "heading" })],
  }),
  createElement("🧱 Elements", {
    type: "p",
  }),
  {
    type: "p",
    children: [
      { text: "AAAAA " },
      createElement("🧱 Elementssss", {
        type: ELEMENT_TAG,
        tag: "Hello World",
      }),
      { text: "BBBBB " },
    ],
  },
  createElement("🔥 Basic Elements", { type: ELEMENT_H2 }),
  createElement("These are the most common elements, known as blocks:"),
  createElement("Blockquote", { type: ELEMENT_BLOCKQUOTE }),
  createElement("💅 Marks", { type: ELEMENT_H1 }),
  createElement("💧 Basic Marks", { type: ELEMENT_H2 }),
  createElement(
    "The basic marks consist of text formatting such as bold, italic, underline, strikethrough, subscript, superscript, and code."
  ),
  createElement("You can customize the type, the component and the hotkey for each of these."),
  createElement("This text is bold.", { mark: MARK_BOLD }),
  createElement("This text is italic.", { mark: MARK_ITALIC }),
  createElement("This text is underlined.", {
    mark: MARK_UNDERLINE,
  }),
  createElement("This is a strikethrough text.", {
    mark: MARK_STRIKETHROUGH,
  }),
  createElement("This is an inline code.", { mark: MARK_CODE }),
];
