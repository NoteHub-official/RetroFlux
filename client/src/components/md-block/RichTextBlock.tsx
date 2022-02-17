import React, { useEffect, useMemo, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea, useColorModeValue, Code, Button } from "@chakra-ui/react";
// wysiwyg
import {
  Editor,
  rootCtx,
  defaultValueCtx,
  editorViewOptionsCtx,
  editorViewCtx,
  serializerCtx,
  commandsCtx,
} from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { EditorRef, ReactEditor, useEditor, useNodeCtx } from "@milkdown/react";
import { commonmark, ToggleItalic } from "@milkdown/preset-commonmark";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { collaborative, y } from "@milkdown/plugin-collaborative";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
// plugins
import cx from "classnames";
import * as Y from "yjs";
import { YMap } from "yjs/dist/src/internals";

export interface RichTextBlockProps {}

const defaultValue = `
  # Hello milkdown\n
  - sadasdasd
  - BBBBBBBBB
  > sadasdasdasd
  > dasdasdadsadasd
  \`\`\`javascript
  def main():
    return 0
  \`\`\`
  sdasdasd`;

const options = [
  { color: "#5e81AC", name: "milkdown user 1" },
  { color: "#8FBCBB", name: "milkdown user 2" },
  { color: "#dbfdbf", name: "milkdown user 3" },
  { color: "#D08770", name: "milkdown user 4" },
];
const rndInt = Math.floor(Math.random() * 4) + 1;

const ydoc = new Y.Doc();
const yMap = ydoc.getMap("editor-states");
yMap.set("editable", true);

const provider = new WebrtcProvider("wysiwyg-room", ydoc);

provider.awareness.setLocalStateField("user", options[rndInt]);
provider.awareness.setLocalStateField("editable", true);
// provider.awareness.clientID = Math.floor(Math.random() * 100) + 1;

const persistence = new IndexeddbPersistence("wysiwyg-room", ydoc);

export const RichTextBlock: React.FC<RichTextBlockProps> = (props) => {
  const [markdownText, setMarkdownText] = useState(defaultValue);
  const [editableState, setEditableState] = useState(true);
  const editable = React.useRef(true);
  const editorRef = useRef<EditorRef>(null);

  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        // ctx.set(defaultValueCtx, defaultValue);
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          setMarkdownText(markdown);
        });
        ctx.set(editorViewOptionsCtx, { editable: () => editable.current });
      })
      .use(nord)
      .use(commonmark)
      .use(listener)
      .use(
        collaborative.configure(y, {
          doc: ydoc,
          awareness: provider.awareness,
        })
      )
  );

  useEffect(() => {
    yMap.observe(() => {
      // update react state only when remote user changes yjs editable state
      if (yMap.get("editable") !== editable.current) {
        handleEditableSwitch();
      }
    });
  }, []);

  const handlePrint = () => {
    if (editorRef.current !== null) {
      const editor = editorRef.current?.get();

      const editorMarkdown = editor?.action((ctx) => {
        const editorView = ctx.get(editorViewCtx);
        const serializer = ctx.get(serializerCtx);
        return serializer(editorView.state.doc);
      });

      setMarkdownText(editorMarkdown || "");
    }
  };

  const handleEditableSwitch = () => {
    if (editorRef.current !== null) {
      editable.current = !editable.current;
      const editor = editorRef.current?.get();

      editor?.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        view.updateState(view.state);
      });

      // set react state
      setEditableState(editable.current);
      // set yjs state
      yMap.set("editable", editable.current);
    }
  };

  const toggleItalic = () => {
    if (editorRef.current !== null) {
      editable.current = !editable.current;
      const editor = editorRef.current?.get();

      editor?.action((ctx) => {
        // get command manager
        const commandManager = ctx.get(commandsCtx);
        // call command
        commandManager.call(ToggleItalic);
      });
    }
  };

  return (
    <div className="md-block min-w-full prose">
      <Button onMouseDown={handleEditableSwitch}>{editableState ? "Preview" : "Edit"}</Button>
      <Button onMouseDown={handlePrint}>Print</Button>
      <Button onMouseDown={toggleItalic}>Italic</Button>
      <ReactEditor editor={editor} ref={editorRef} />
      <pre>{markdownText}</pre>
    </div>
  );
};

const CustomParagraph: React.FC = ({ children }) => <div className="react-paragraph">{children}</div>;

const CustomImage: React.FC = ({ children }) => {
  const { node } = useNodeCtx();

  return (
    <img className="react-image" src={node.attrs.src} alt={node.attrs.alt} title={node.attrs.title} />
  );
};
