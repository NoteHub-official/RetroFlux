import React, { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea, useColorModeValue, Code } from "@chakra-ui/react";
// plugins
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import rehypeKatex from "rehype-katex";
import cx from "classnames";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";

export interface MarkdownBlockProps {}

const markdown = `$$
f(x) = \\frac{1}{2} \\rightarrow, \\ x \\in \\{0,1\\}^* = L
$$
sadadasdasdasd$asdassssasd$asdasdasd \\frac{}{}sadasd`;

const ydoc = new Y.Doc();
const yText = ydoc.getText("md-text");
const provider = new WebrtcProvider("md-room", ydoc);
const persistence = new IndexeddbPersistence("md-room", ydoc);

export const MarkdownBlock: React.FC<MarkdownBlockProps> = (props) => {
  const [markdownText, setMarkdownText] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    Y.transact(ydoc, () => {
      yText.delete(0, yText.length);
      yText.insert(0, newValue);
    });
  };

  useEffect(() => {
    yText.observe(() => {
      setMarkdownText(yText.toString());
    });
  }, []);

  useEffect(() => {
    persistence.once("synced", () => {});
  }, []);

  return (
    <div className="md-block min-w-full prose">
      <Textarea value={markdownText} onChange={handleChange} height="xs" />
      <ReactMarkdown
        children={markdownText}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: (props) => <CodeElement {...props} />,
          // @ts-ignore
          div: (props) => {
            const { children, node, className } = props;
            const margin = className?.split(" ").includes("math-display");
            return <div className={cx(className, { "flex justify-center": margin })}>{children}</div>;
          },
          // span: (props) => {
          //   const { children, node, className } = props;
          //   const margin = className?.split(" ").includes("math-inline");

          //   return <span className={cx(className, { "mx-1": margin }, "text-base")}>{children}</span>;
          // },
          // p: (props) => {
          //   const { children, node, className } = props;

          //   return <p className={cx(className, "flex items-center")}>{children}</p>;
          // },
          // li: (props) => {
          //   const { children, node, className } = props;

          //   return <li className={cx(className, "flex items-center")}>{children}</li>;
          // },
        }}
      />
    </div>
  );
};

const CodeElement = (props: any) => {
  const color = useColorModeValue("blue.400", "red.400");

  return <Code {...props} className="bg-gray-200 p-1 rounded-md" color={color} />;
};
