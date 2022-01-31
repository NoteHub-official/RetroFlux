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
  createPlugins,
  createPlateUI,
  usePlateStore,
  createPluginFactory,
  PlatePluginComponent,
  usePlateEditorState,
  HeadingToolbar,
} from "@udecode/plate";
import { initialEditorValue } from "./values";
import { useColorModeValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import debounce from "lodash/debounce";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { CursorEditor, withCursors, withYHistory, withYjs, YjsEditor } from "@slate-yjs/core";
import randomColor from "randomcolor";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { RemoteCursorOverlay } from "./Overlay";
import { CursorData } from "./Overlay";

const ELEMENT_TAG = "tag";

export const FluxEditor: React.FC = () => {
  const storeApi = usePlateStore();
  const editor = usePlateEditorState("flux-editor");

  const initialValue: any = useMemo(() => {
    const savedValue: any = localStorage.getItem("plate-value");
    return initialEditorValue;
  }, []);

  const [value, setValue] = useState<TNode<AnyObject> | null>(initialValue);
  const borderColor = useColorModeValue("zinc.300", "whiteAlpha.300");

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: "ws://127.0.0.1:1234",
        parameters: { key: "" },
        name: "slate-yjs-demo",
      }),
    []
  );

  // Stored in CONFIG.editableProps
  const editableProps = {
    placeholder: "Type…",
    style: {
      padding: "15px",
    },
  };

  const createOverridePlugin = createPluginFactory({
    key: "yjs",
    withOverrides: (editor, plugins) => {
      const cursorData: CursorData = {
        color: randomColor({
          luminosity: "dark",
          alpha: 1,
          format: "hex",
        }),
        name: "Brian Yin",
      };
      const sharedType = provider.document.get("content", Y.XmlText) as Y.XmlText;

      return withYHistory(
        withCursors(withYjs(editor, sharedType), provider.awareness, {
          data: cursorData,
        })
      );
    },
  });

  const TagComponent: PlatePluginComponent = (props) => {
    const { attributes, children, nodeProps, element } = props;

    return (
      <Box
        cursor={"pointer"}
        as="span"
        color="zinc.100"
        fontWeight="bold"
        bg="purple.500"
        rounded="sm"
        px={1}
        fontSize="sm"
        {...attributes}
        _focus={{ boxShadow: "none", ring: 2 }}
        contentEditable={false}
      >
        <span>#{nodeProps.tag}</span>
        <span>{children}</span>
      </Box>
    );
  };

  const createTagPlugin = createPluginFactory({
    key: ELEMENT_TAG,
    isElement: true,
    isInline: true,
    isVoid: true,
    isLeaf: true,
    props: ({ element }) => ({ nodeProps: { tag: element?.tag } }),
    component: TagComponent,
  });

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
      createOverridePlugin(),
      createTagPlugin(),
    ],
    {
      // Plate components
      components: createPlateUI(),
    }
  );

  const handleChange = useCallback((value) => {
    const debounced = debounce(() => {
      setValue(value);
      //   localStorage.setItem("plate-value", JSON.stringify(value));
    }, 1000);
    debounced();
  }, []);

  // @ts-ignore
  console.log(CursorEditor.cursorStates(editor));

  return (
    <React.Fragment>
      <Box borderWidth={1} borderColor={borderColor} w={"full"} rounded="md" px={4} py={3} mb={4}>
        <HeadingToolbar></HeadingToolbar>

        <Plate
          id="1"
          editableProps={{ ...editableProps, spellCheck: false }}
          normalizeInitialValue
          initialValue={initialValue}
          onChange={(value) => handleChange(value)}
          plugins={plugins}
          renderEditable={(editable) => {
            return <RemoteCursorOverlay>{editable}</RemoteCursorOverlay>;
          }}
        />
      </Box>
      <Box px={4} fontSize="xs" maxW="full" overflowX="auto">
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </Box>
    </React.Fragment>
  );
};
