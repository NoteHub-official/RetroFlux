import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea, useColorModeValue, Code } from "@chakra-ui/react";

export interface MarkdownBlockProps {}

const markdown = `Just a link: https://reactjs.com.- Adopting a linear + sigmoid model is equivalent to assuming ***linear log odds***.

$$
log \frac{P(y=1|x)}{P(y=-1|x)}=w^Tx+b
$$

- This happens when $P(x|y=1)$  and $P(x|y=-1)$ are Gaussians with different means and the same covariance matrices ($w$ is related to the difference between the means)
- Maximum (conditional) likekihood estimate: find $w$ that minimizes`;

export const MarkdownBlock: React.FC<MarkdownBlockProps> = (props) => {
  const [markdownText, setMarkdownText] = React.useState(markdown);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  return (
    <div className="md-block min-w-full">
      <Textarea value={markdownText} onChange={handleChange} />
      <ReactMarkdown
        children={markdownText}
        remarkPlugins={[remarkGfm]}
        components={{
          // @ts-ignore
          a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          h1: (props) => <h1 {...props} className="text-2xl font-bold" />,
          h2: (props) => <h2 {...props} className="text-xl font-bold" />,
          h3: (props) => <h3 {...props} className="text-lg font-bold" />,
          h4: (props) => <h4 {...props} className="text-base font-bold" />,
          h5: (props) => <h5 {...props} className="text-base font-bold" />,
          h6: (props) => <h6 {...props} className="text-base font-bold" />,
          p: (props) => <p {...props} className="text-base" />,
          li: (props) => <li {...props} className="text-base" />,
          strong: (props) => <strong {...props} className="font-bold" />,
          em: (props) => <em {...props} className="italic" />,
          blockquote: (props) => <blockquote {...props} className="blockquote" />,
          code: (props) => <CodeElement {...props} />,
        }}
      />
    </div>
  );
};

const CodeElement = (props: any) => {
  const color = useColorModeValue("blue-400", "red-400");

  return <Code {...props} className="bg-gray-200 p-1 rounded-md" color={color} />;
};
