import React, { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea, useColorModeValue, Code } from "@chakra-ui/react";
// plugins
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkMdx from "remark-mdx";
import cx from "classnames";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
import { MDXProvider } from "@mdx-js/react";
import { visit } from "unist-util-visit";

function myRemarkPlugin() {
  /** @param {import('@types/mdast').Root} tree */
  return (tree: any) => {
    visit(tree, (node) => {
      // `node` can now be one of the nodes for JSX, expressions, or ESM.
      console.log(node);
    });
  };
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export interface MarkdownBlockProps {}

const ydoc = new Y.Doc();
const provider = new WebrtcProvider("md-room", ydoc);
const persistence = new IndexeddbPersistence("md-room", ydoc);

export const MarkdownBlock: React.FC<MarkdownBlockProps> = (props) => {
  const yText = useMemo(() => {
    return ydoc.getText("md-text");
  }, []);

  const [markdownText, setMarkdownText] = React.useState<string>("");

  // try open another browser and see if typing can be shared!
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
      {/* <MDXProvider>
        <div style={{ color: "red" }}>sadasda</div>
      </MDXProvider> */}
      <ErrorBoundary markdownText={markdownText}>
        <ReactMarkdown
          children={markdownText}
          skipHtml
          sourcePos
          linkTarget={"_blank"}
          remarkPlugins={[remarkMdx, remarkGfm, remarkMath, myRemarkPlugin, remarkMdx]}
          rehypePlugins={[rehypeKatex]}
          transformLinkUri={(href, children, title) => {
            return title || "";
          }}
          components={{
            // @ts-ignore
            div: (props) => {
              const { children, node, className } = props;
              const margin = className?.split(" ").includes("math-display");
              return <div className={cx(className, { "flex justify-center": margin })}>{children}</div>;
            },
            h1: (props) => (
              <h1 {...props} className="text-4xl font-bold border-b-[1px] pb-2">
                {props.children}
              </h1>
            ),
            h2: (props) => (
              <h2 {...props} className="text-3xl font-bold border-b-[1px] pb-2">
                {props.children}
              </h2>
            ),
            h3: (props) => (
              <h3 {...props} className="text-2xl font-bold border-b-[1px] pb-2">
                {props.children}
              </h3>
            ),
            blockquote: (props) => {
              const { children, node, className } = props;
              return (
                <blockquote className={cx(className, "whitespace-pre-wrap")}>{children}</blockquote>
              );
            },
          }}
        />
      </ErrorBoundary>
    </div>
  );
};
