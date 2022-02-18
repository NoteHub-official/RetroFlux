import { AtomList, createNode } from "@milkdown/utils";
import { RemarkPlugin } from "@milkdown/core";
import directive from "remark-directive";
import { InputRule } from "prosemirror-inputrules";

const id = "iframe";
const iframe = createNode(() => ({
  id,
  schema: () => ({
    inline: true,

    attrs: {
      src: { default: null },
    },

    group: "inline",

    marks: "",

    parseDOM: [
      {
        tag: "iframe",
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) {
            throw new Error();
          }
          return {
            src: dom.getAttribute("src"),
          };
        },
      },
    ],

    toDOM: (node) => ["iframe", { ...node.attrs, class: "iframe" }, 0],

    remarkPlugins: () => [directive as RemarkPlugin],

    parseMarkdown: {
      match: (node) => node.type === "textDirective" && node.name === "iframe",
      runner: (state, node, type) => {
        state.addNode(type, { src: (node.attributes as { src: string }).src });
      },
    },

    toMarkdown: {
      match: (node) => node.type.name === id,
      runner: (state, node) => {
        state.addNode("textDirective", undefined, undefined, {
          name: "iframe",
          attributes: {
            src: node.attrs.src,
          },
        });
      },
    },
  }),
  inputRules: (nodeType) => [
    new InputRule(/:iframe\{src\="(?<src>[^"]+)?"?\}/, (state, match, start, end) => {
      const [okey, src = ""] = match;
      const { tr } = state;

      if (okey) {
        tr.replaceWith(start, end, nodeType.create({ src }));
      }

      return tr;
    }),
  ],
}));

export const IFramePlugin = AtomList.create([iframe()]);
