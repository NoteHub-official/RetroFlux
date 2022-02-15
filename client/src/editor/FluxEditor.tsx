/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TNode,
  AnyObject,
  usePlateStore,
  createPluginFactory,
  PlatePluginComponent,
  usePlateEditorState,
  createPlateUI,
  HeadingToolbar,
  MentionCombobox,
  Plate,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHighlightPlugin,
  createKbdPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createDndPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  createComboboxPlugin,
  createMentionPlugin,
  createIndentPlugin,
  createFontColorPlugin,
  createFontBackgroundColorPlugin,
  createDeserializeMdPlugin,
  createDeserializeCsvPlugin,
  createNormalizeTypesPlugin,
  createFontSizePlugin,
  createHorizontalRulePlugin,
  createPlugins,
  createDeserializeDocxPlugin,
  createJuicePlugin,
  withPlate,
  createPlateEditor,
} from "@udecode/plate";
import {
  createExcalidrawPlugin,
  ELEMENT_EXCALIDRAW,
  ExcalidrawElement,
} from "@udecode/plate-ui-excalidraw";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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

const WEBSOCKET_ENDPOINT = "ws://127.0.0.1:1234";

export const FluxEditor: React.FC = () => {
  const initialValue: any = useMemo(() => {
    const savedValue: any = localStorage.getItem("plate-value");
    return initialEditorValue;
  }, []);

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
      // ...
      createTodoListPlugin(),
      createImagePlugin(),
      createHorizontalRulePlugin(),
      createLinkPlugin(),
      createListPlugin(),
      createTablePlugin(),
      createMediaEmbedPlugin(),
      createExcalidrawPlugin(),
      createHighlightPlugin(),
      createSubscriptPlugin(),
      createSuperscriptPlugin(),
      createFontColorPlugin(),
      createFontBackgroundColorPlugin(),
      createFontSizePlugin(),
      createKbdPlugin(),
      createNodeIdPlugin(),
      createDndPlugin(),
      // createAlignPlugin(CONFIG.align),
      // createIndentPlugin(CONFIG.indent),
      // createAutoformatPlugin(CONFIG.autoformat),
      // createResetNodePlugin(CONFIG.resetBlockType),
      // createSoftBreakPlugin(CONFIG.softBreak),
      // createExitBreakPlugin(CONFIG.exitBreak),
      // createNormalizeTypesPlugin(CONFIG.forceLayout),
      // createTrailingBlockPlugin(CONFIG.trailingBlock),
      // createSelectOnBackspacePlugin(CONFIG.selectOnBackspace),
      createComboboxPlugin(),
      createMentionPlugin(),
      createDeserializeMdPlugin(),
      createDeserializeCsvPlugin(),
      createDeserializeDocxPlugin(),
      createJuicePlugin(),
    ],
    {
      // Plate components
      components: createPlateUI(),
    }
  );

  const [value, setValue] = useState<Descendant[]>(initialValue);
  const borderColor = useColorModeValue("zinc.300", "whiteAlpha.300");

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: WEBSOCKET_ENDPOINT,
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

  // Setup the binding
  const editor = useMemo(() => {
    const cursorData: CursorData = {
      color: randomColor({
        luminosity: "dark",
        alpha: 1,
        format: "hex",
      }),
      name: "Brian",
    };

    const sharedType = provider.document.get("content", Y.XmlText) as Y.XmlText;

    return withReact(
      withYHistory(
        withCursors(
          withYjs(
            createPlateEditor({
              plugins,
            }),
            sharedType
          ),
          provider.awareness,
          {
            data: cursorData,
          }
        )
      )
    );
  }, [provider.awareness, provider.document]);

  const handleChange = useCallback((value) => {
    const debounced = debounce(() => {
      setValue(value);
      //   localStorage.setItem("plate-value", JSON.stringify(value));
    }, 1000);
    debounced();
  }, []);

  // Disconnect YjsEditor on unmount in order to free up resources
  useEffect(() => () => YjsEditor.disconnect(editor), [editor]);
  useEffect(() => () => provider.disconnect(), [provider]);

  // console.log(CursorEditor.cursorStates(editor));
  console.log("asdasd");

  return (
    <React.Fragment>
      <Box borderWidth={1} borderColor={borderColor} w={"full"} rounded="md" px={4} py={3} mb={4}>
        <HeadingToolbar></HeadingToolbar>
        <DndProvider backend={HTML5Backend}>
          <Plate
            id="main"
            editor={editor}
            editableProps={{ ...editableProps, spellCheck: false }}
            initialValue={initialValue}
            normalizeInitialValue
            // onChange={(value) => handleChange(value)}
            renderEditable={(editable) => {
              return <RemoteCursorOverlay>{editable}</RemoteCursorOverlay>;
            }}
          />
        </DndProvider>
      </Box>
      <Box px={4} fontSize="xs" maxW="full" overflowX="auto">
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </Box>
    </React.Fragment>
  );
};
