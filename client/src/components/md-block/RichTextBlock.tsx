/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/iframe-has-title */
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
  parserCtx,
} from "@milkdown/core";
import { Slice } from "@milkdown/prose";
import { nord } from "@milkdown/theme-nord";
import { EditorRef, ReactEditor, useEditor, useNodeCtx } from "@milkdown/react";
import { commonmark, ToggleItalic } from "@milkdown/preset-commonmark";
import { collaborative, y } from "@milkdown/plugin-collaborative";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
// plugins
import cx from "classnames";
import * as Y from "yjs";

// @ts-ignore
import { MonacoBinding } from "y-monaco";

import { iframePlugin, iframe } from "./iframePlugin";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { clipboard } from "@milkdown/plugin-clipboard";
import { cursor } from "@milkdown/plugin-cursor";
import { prism } from "@milkdown/plugin-prism";
import { math, mathBlock } from "@milkdown/plugin-math";
import { tooltipPlugin, tooltip } from "@milkdown/plugin-tooltip";
import { slashPlugin, slash, createDropdownItem, defaultActions } from "@milkdown/plugin-slash";
import { themeToolCtx } from "@milkdown/core";
import { emoji } from "@milkdown/plugin-emoji";
import { indent, indentPlugin } from "@milkdown/plugin-indent";
import { diagram } from "@milkdown/plugin-diagram";
import { gfm, paragraph, image, codeFence } from "@milkdown/preset-gfm";

export interface RichTextBlockProps {}

const defaultValue = `
# Getting Started

## Overview

Milkdown is a lightweight but powerful WYSIWYG markdown editor. It's made up by two parts:

*   A tiny core which provides plugin loader and kinds of internal plugins.

*   Lots of plugins provide syntax, commands and components.

With this pattern you can enable or disable any custom syntax and feature you like, such as table, latex and slash commands. You can even create your own plugin to support your awesome idea.

> 🍼 Fun fact: The Milkdown documentation is rendered by milkdown.

***

## Features

*   [x] check\_box

    📝 **WYSIWYG Markdown** - Write markdown in an elegant way

*   [x] check\_box

    🎨 **Themable** - Theme can be shared and used with npm packages

*   [x] check\_box

    🎮 **Hackable** - Support your awesome idea by plugin

*   [x] check\_box

    🦾 **Reliable** - Built on top of [prosemirror](https://prosemirror.net/) and [remark](https://github.com/remarkjs/remark)

*   [x] check\_box

    ⚡ **Slash & Tooltip** - Write fast for everyone, driven by plugin

*   [x] check\_box

    🧮 **Math** - LaTeX math equations support, driven by plugin

*   [x] check\_box

    📊 **Table** - Table support with fluent ui, driven by plugin

*   [x] check\_box

    🍻 **Collaborate** - Shared editing support with [yjs](https://docs.yjs.dev/), driven by plugin

*   [x] check\_box

    💾 **Clipboard** - Support copy and paste markdown, driven by plugin

*   [x] check\_box

    👍 **Emoji** - Support emoji shortcut and picker, driven by plugin

## Tech Stack

:iframe{src="https://campuswire.com/c/G0CBE9E0E/feed/555"}
:iframe{src="https://www.bilibili.com/"}
:iframe{src="https://replit.com/@ritza/demo-embed?embed=true"}
:iframe{src="https://docs.google.com/document/d/1jiIJU3ydPsGQzuRJdfexS6I_d2dvanK2DtqC5hVC-6w/edit"}

Milkdown is built on top of these tools:

*   [Prosemirror](https://prosemirror.net/) and its community - A toolkit for building rich-text editors on the web

*   [Remark](https://github.com/remarkjs/remark) and its community - Markdown parser done right

*   [TypeScript](https://www.typescriptlang.org/) - Developed in TypeScript

*   [Emotion](https://emotion.sh/) - Powerful CSS in JS tool to write styles

*   [Prism](https://prismjs.com/) - Code snippets support

*   [Katex](https://katex.org/) - LaTex math rendering

***

You can type \`||\` and a \`space\` to create a table:

| First Header   |    Second Header   |
| :------------- | :----------------: |
| Content Cell 1 |  \`Content\` Cell 1  |
| Content Cell 2 | **Content** Cell 2 |

***

Math is supported by [TeX expression](https://en.wikipedia.org/wiki/TeX).

Now we have some inline math: $E = mc^2$. You can click to edit it.

Math block is also supported.

$$
\\begin{aligned}
T( (v_1 + v_2) \\otimes w) &= T(v_1 \\otimes w) + T(v_2 \\otimes w) \\\\
T( v \\otimes (w_1 + w_2)) &= T(v \\otimes w_1) + T(v \\otimes w_2) \\\\
T( (\\alpha v) \\otimes w ) &= T( \\alpha ( v \\otimes w) ) \\\\
T( v \\otimes (\\alpha w) ) &= T( \\alpha ( v \\otimes w) ) \\\\
\\end{aligned}
$$


## First editor

We have some pieces of code for you to create a very minimal editor:

> **We use [material icon](https://fonts.google.com/icons) and [Roboto Font](https://fonts.google.com/specimen/Roboto) in our theme**. Make sure to include them for having the best experience.

typescript

    import { Editor } from '@milkdown/core';
    import { nord } from '@milkdown/theme-nord';
    import { commonmark } from '@milkdown/preset-commonmark';

    Editor.make().use(nord).use(commonmark).create();

## Taste the plugin

Now let's add an **undo & redo** support for our editor:

typescript

    import { Editor } from '@milkdown/core';
    import { nord } from '@milkdown/theme-nord';
    import { commonmark } from '@milkdown/preset-commonmark';
    import { history } from '@milkdown/plugin-history';

    Editor.make().use(nord).use(commonmark).use(history).create();

> \`Mod\` is \`Cmd\` for mac and \`Ctrl\` for other platforms.

Now we can undo a edit by using \`Mod-z\` and redo it by using \`Mod-y\` or \`Shift-Mod-Z\`.

***

## Online Demo

:iframe{src="https://codesandbox.io/embed/milkdown-vanilla-setup-8xobc?fontsize=14&hidenavigation=1&theme=dark&view=preview"}
`;

const options = [
  { color: "#5e81AC", name: "milkdown user 1" },
  { color: "#8FBCBB", name: "milkdown user 2" },
  { color: "#dbfdbf", name: "milkdown user 3" },
  { color: "#D08770", name: "milkdown user 4" },
];
const rndInt = Math.floor(Math.random() * 4) + 1;

const ydoc = new Y.Doc();
const type = ydoc.getText("monaco");
const yMap = ydoc.getMap("editor-states");
yMap.set("editable", true);

const provider = new WebrtcProvider("monaco-room", ydoc);

provider.awareness.setLocalStateField("user", options[rndInt]);
// provider.awareness.clientID = Math.floor(Math.random() * 100) + 1;

const persistence = new IndexeddbPersistence("monaco-room", ydoc);

export const RichTextBlock: React.FC<RichTextBlockProps> = (props) => {
  const [markdownText, setMarkdownText] = useState(defaultValue);
  const [editableState, setEditableState] = useState(true);
  const editable = React.useRef(true);
  const editorRef = useRef<EditorRef>(null);
  const monacoRef = useRef<any>();

  const editor = useEditor(
    (root, renderReact) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
          // ctx.set(defaultValueCtx, defaultValue);
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
            // setMarkdownText(markdown);
          });
          ctx.set(editorViewOptionsCtx, { editable: () => editable.current });
        })
        .use(nord)
        .use([
          iframe({
            view: renderReact(ReactIframe),
          }),
        ])
        .use(
          gfm
            .configure(paragraph, { view: renderReact(CustomParagraph) })
            .configure(image, { view: renderReact(CustomImage) })
          // .configure(codeFence, { view: renderReact(CustomCodeFence) })
        )
        .use(listener)
        .use(clipboard)
        .use(cursor)
        .use(prism)
        .use(diagram)
        .use(tooltip)
        .use(math)
        .use(emoji)
        .use(indent)
        .use(slash)
    // .use(
    //   collaborative.configure(y, {
    //     doc: ydoc,
    //     awareness: provider.awareness,
    //   })
    // )
  );

  useEffect(() => {
    yMap.observe(() => {
      console.log("yMap changed");
      // update react state only when yjs has updated
      if (yMap.get("editable") !== editable.current) {
        handleEditableSwitch();
      }
    });
    type.observe(() => {
      setMarkdownText(type.toJSON());
    });
  }, []);

  useEffect(() => {
    handleMarkdownChange();
  }, [markdownText, editorRef]);

  const handleMarkdownChange = () => {
    if (editorRef.current) {
      const editor = editorRef.current?.get();

      editor?.action((ctx) => {
        // update markdown text
        const view = ctx.get(editorViewCtx);
        const parser = ctx.get(parserCtx);
        try {
          const doc = parser(markdownText);
          if (!doc) return;
          const state = view.state;
          view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)));
        } catch {
          return;
        }
      });
    }
  };

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

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monacoRef.current = editor;
    const monacoBinding = new MonacoBinding(
      type,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
  };

  return (
    <div className="md-block min-w-full prose">
      <Button onMouseDown={handleEditableSwitch}>{editableState ? "Preview" : "Edit"}</Button>
      <Button onMouseDown={handlePrint}>Print</Button>
      <Button onMouseDown={toggleItalic}>Italic</Button>
      <MonacoEditor
        defaultValue={markdownText}
        defaultLanguage="markdown"
        onMount={handleEditorDidMount}
        // onChange={(value) => setMarkdownText(value || "")}
        theme="vs-dark"
        height="50vh"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <div className="max-h-[50vh] overflow-scroll">
        <ReactEditor editor={editor} ref={editorRef} />
      </div>
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

const ReactIframe = () => {
  const { node } = useNodeCtx();
  console.log(node);
  return (
    <div className="react-iframe border p-2 rounded-lg" contentEditable={false}>
      <div className="bg-gray-300 h-8 mb-2 rounded-md flex items-center px-2">
        <div className="text-gray-50">{node.attrs.src}</div>
      </div>
      <iframe src={node.attrs.src} className="w-full min-h-[400px] rounded-md" />
    </div>
  );
};

const CustomCodeFence: React.FC = ({ children }) => {
  const { node } = useNodeCtx();
  const language = node.attrs.language || "javascript";

  return (
    <div className={cx("code-fence")}>
      <pre className="not-prose" data-language={language}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

// useEffect(() => {
//   yMap.observe(() => {
//     console.log(yMap.get("editable"), editableState);
//     // update react state only when remote user changes yjs editable state
//     if (yMap.get("editable") !== editableState) {
//       setEditableState(yMap.get("editable") as boolean);
//     }
//   });
// }, [editableState]);

// useEffect(() => {
//   console.log("editableState changed");
//   if (editorRef.current !== null) {
//     editable.current = editableState;
//     const editor = editorRef.current?.get();

//     editor?.action((ctx) => {
//       const view = ctx.get(editorViewCtx);
//       view.updateState(view.state);
//     });
//   }
//   yMap.set("editable", editableState);
// }, [editableState]);

// const handlePrint = () => {
//   if (editorRef.current !== null) {
//     const editor = editorRef.current?.get();

//     const editorMarkdown = editor?.action((ctx) => {
//       const editorView = ctx.get(editorViewCtx);
//       const serializer = ctx.get(serializerCtx);
//       return serializer(editorView.state.doc);
//     });

//     setMarkdownText(editorMarkdown || "");
//   }
// };

// const toggleItalic = () => {
//   if (editorRef.current !== null) {
//     editable.current = !editable.current;
//     const editor = editorRef.current?.get();

//     editor?.action((ctx) => {
//       // get command manager
//       const commandManager = ctx.get(commandsCtx);
//       // call command
//       commandManager.call(ToggleItalic);
//     });
//   }
// };

// return (
//   <div className="md-block min-w-full prose">
//     <Button onClick={() => setEditableState(!editableState)}>
//       {editableState ? "Preview" : "Edit"}
//     </Button>
//     <Button onClick={handlePrint}>Print</Button>
//     <Button onClick={toggleItalic}>Italic</Button>
//     <ReactEditor editor={editor} ref={editorRef} />
//     <pre>{markdownText}</pre>
//   </div>
// );
