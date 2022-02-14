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
import {
  CursorEditor,
  withCursors,
  withYHistory,
  withYjs,
  YjsEditor,
  slateNodesToInsertDelta,
} from "@slate-yjs/core";
import randomColor from "randomcolor";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { RemoteCursorOverlay } from "./Overlay";
import { CursorData } from "./Overlay";

const WEBSOCKET_ENDPOINT = "ws://localhost:1234";

export const WsEditor: React.FC = () => {
  const initialValue: any = useMemo(() => {
    const savedValue: any = localStorage.getItem("plate-value");
    return initialEditorValue;
  }, []);

  // Stored in CONFIG.editableProps
  const editableProps = {
    placeholder: "Type…",
    style: {
      padding: "15px",
    },
  };

  const name = "Brian";
  const color = useMemo(
    () =>
      randomColor({
        luminosity: "dark",
        format: "rgba",
        alpha: 1,
      }),
    []
  );

  const [value, setValue] = useState<Descendant[]>(initialValue);
  const borderColor = useColorModeValue("zinc.300", "whiteAlpha.300");

  // Create the Yjs doc and fetch if it's available from the server
  const [sharedTypeContent, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const sharedTypeContent = doc.get("content", Y.XmlText) as Y.XmlText;
    const provider = new WebsocketProvider(WEBSOCKET_ENDPOINT, "slug123", doc, {
      connect: false,
    });

    return [sharedTypeContent, provider];
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
    ],
    {
      // Plate components
      components: createPlateUI(),
    }
  );

  // Setup the binding
  const editor = useMemo(() => {
    const cursorData: CursorData = {
      color: color,
      name: name,
    };

    return withReact(
      withYHistory(
        withCursors(
          withYjs(
            createPlateEditor({
              plugins,
              disableCorePlugins: {
                history: true,
              },
            }),
            sharedTypeContent
          ),
          provider.awareness,
          {
            data: cursorData,
          }
        )
      )
    );
  }, [provider.awareness, sharedTypeContent]);

  const handleChange = useCallback((value) => {
    const debounced = debounce(() => {
      setValue(value);
      //   localStorage.setItem("plate-value", JSON.stringify(value));
    }, 1000);
    debounced();
  }, []);

  // Disconnect YjsEditor on unmount in order to free up resources
  // Disconnect the binding on component unmount in order to free up resources
  useEffect(() => () => YjsEditor.disconnect(editor), [editor]);
  useEffect(() => {
    /*provider.on("status", ({ status }: { status: string }) => {
      setOnlineState(status === "connected");
    });*/

    provider.awareness.setLocalState({
      alphaColor: color.slice(0, -2) + "0.2)",
      color,
      name,
    });

    provider.on("sync", (isSynced: boolean) => {
      if (isSynced) {
        if (sharedTypeContent.length === 0) {
          const insertDelta = slateNodesToInsertDelta(initialValue);
          sharedTypeContent.applyDelta(insertDelta);
        }
        console.log(sharedTypeContent);
      }
    });

    provider.connect();

    return () => {
      provider.disconnect();
    };
  }, [color, sharedTypeContent, provider]);

  // @ts-ignore
  console.log(CursorEditor.cursorStates(editor));

  return (
    <React.Fragment>
      <Box borderWidth={1} borderColor={borderColor} w={"full"} rounded="md" px={4} py={3} mb={4}>
        <HeadingToolbar></HeadingToolbar>

        <Plate
          id="main"
          editor={editor}
          editableProps={{ ...editableProps, spellCheck: false }}
          normalizeInitialValue
          initialValue={initialValue}
          onChange={setValue}
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
