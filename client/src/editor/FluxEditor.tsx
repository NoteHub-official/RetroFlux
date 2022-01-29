import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plate,
  TNode,
  AnyObject,
  createParagraphPlugin,
  createBlockquotePlugin,
  createCodeBlockPlugin,
  createHeadingPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createCodePlugin,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MARK_STRIKETHROUGH,
  MARK_CODE,
  ELEMENT_CODE_LINE,
  ELEMENT_BLOCKQUOTE,
  createPlugins,
  createPlateUI,
  createPlateEditor,
  withPlate,
  pipe,
  usePlate,
  usePlateStore,
} from "@udecode/plate";
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_CODE_BLOCK,
  ELEMENT_PARAGRAPH,
} from "@udecode/plate";
import { useColorModeValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { createEditor } from "slate";
import { withReact } from "slate-react";

export const FluxEditor: React.FC = () => {
  const storeApi = usePlateStore();

  const editor = useMemo(() => storeApi.store.getState().editor, [storeApi.store]);
  const [value, setValue] = useState<TNode<AnyObject> | null>(null);
  const borderColor = useColorModeValue("zinc.300", "whiteAlpha.300");

  // Stored in CONFIG.editableProps
  const editableProps = {
    placeholder: "Type…",
    style: {
      padding: "15px",
    },
  };

  const initialValue = [
    createElement("🧱 Elements", { type: ELEMENT_H1 }),
    createElement("🔥 Basic Elements", { type: ELEMENT_H2 }),
    createElement("These are the most common elements, known as blocks:"),
    createElement("Heading 1", { type: ELEMENT_H1 }),
    createElement("Heading 2", { type: ELEMENT_H2 }),
    createElement("Heading 3", { type: ELEMENT_H3 }),
    createElement("Heading 4", { type: ELEMENT_H4 }),
    createElement("Heading 5", { type: ELEMENT_H5 }),
    createElement("Heading 6", { type: ELEMENT_H6 }),
    createElement("Blockquote", { type: ELEMENT_BLOCKQUOTE }),
    {
      type: ELEMENT_CODE_BLOCK,
      children: [
        {
          type: ELEMENT_CODE_LINE,
          children: [
            {
              text: "const a = 'Hello';",
            },
          ],
        },
        {
          type: ELEMENT_CODE_LINE,
          children: [
            {
              text: "const b = 'World';",
            },
          ],
        },
      ],
    },
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
    {
      type: ELEMENT_PARAGRAPH,
      children: [
        {
          text: "This text is bold, italic and underlined.",
          [MARK_BOLD]: true,
          [MARK_ITALIC]: true,
          [MARK_UNDERLINE]: true,
        },
      ],
    },
    createElement("This is a strikethrough text.", {
      mark: MARK_STRIKETHROUGH,
    }),
    createElement("This is an inline code.", { mark: MARK_CODE }),
  ];

  const plugins = createPlugins(
    [
      // elements
      createParagraphPlugin(), // paragraph element
      createBlockquotePlugin(), // blockquote element
      createCodeBlockPlugin(), // code block element
      createHeadingPlugin(), // heading elements

      // marks
      createBoldPlugin(), // bold mark
      createItalicPlugin(), // italic mark
      createUnderlinePlugin(), // underline mark
      createStrikethroughPlugin(), // strikethrough mark
      createCodePlugin(), // code mark
    ],
    {
      // Plate components
      components: createPlateUI(),
    }
  );

  return (
    <React.Fragment>
      <Box borderWidth={1} borderColor={borderColor} w={"full"} rounded="md" px={4} py={3} mb={4}>
        <Plate
          id="1"
          editableProps={editableProps}
          initialValue={initialValue}
          onChange={(value) => {
            // @ts-ignore
            setValue(value);
          }}
          plugins={plugins}
        />
      </Box>
      <Box px={4} fontSize="sm">
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </Box>
    </React.Fragment>
  );
};

// @ts-ignore
const createElement = (text: string, { type = ELEMENT_PARAGRAPH, mark }: any = {}) => {
  const leaf = { text };
  if (mark) {
    // @ts-ignore
    leaf[mark] = true;
  }

  return {
    type,
    children: [leaf],
  };
};
