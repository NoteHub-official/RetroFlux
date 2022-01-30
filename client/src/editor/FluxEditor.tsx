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
  HotkeyPlugin,
  PlatePluginComponent,
  usePlateEditorState,
  getPluginType,
  ELEMENT_DEFAULT,
} from "@udecode/plate";
import { initialEditorValue } from "./values";
import { useColorModeValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import debounce from "lodash/debounce";

const ELEMENT_TAG = "tag";

export const FluxEditor: React.FC = () => {
  const storeApi = usePlateStore();
  const editor = usePlateEditorState();

  const initialValue: any = useMemo(() => {
    const savedValue: any = localStorage.getItem("plate-value");
    return initialEditorValue;
  }, []);

  const [value, setValue] = useState<TNode<AnyObject> | null>(initialValue);
  const borderColor = useColorModeValue("zinc.300", "whiteAlpha.300");

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
      // ...
      return editor;
    },
  });

  const TagComponent: PlatePluginComponent = (props) => {
    const { attributes, children, nodeProps, element } = props;
    console.log(nodeProps);
    return (
      <Box
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
      createOverridePlugin({
        plugins: [createBlockquotePlugin()],
      }),
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
      localStorage.setItem("plate-value", JSON.stringify(value));
    }, 1000);
    debounced();
  }, []);

  return (
    <React.Fragment>
      <Box borderWidth={1} borderColor={borderColor} w={"full"} rounded="md" px={4} py={3} mb={4}>
        <Plate
          id="1"
          editableProps={editableProps}
          normalizeInitialValue
          initialValue={initialValue}
          onChange={(value) => handleChange(value)}
          plugins={plugins}
        />
      </Box>
      <Box px={4} fontSize="xs" maxW="full" overflowX="auto">
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </Box>
    </React.Fragment>
  );
};
