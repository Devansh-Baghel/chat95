// components/MarkdownWithCopy.tsx

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // or any other theme

import { useState } from "react";

function CodeBlock({ children, className = "" }: any) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") ?? "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="relative group my-4">
      <pre
        className={`rounded-md p-4 overflow-x-auto bg-[#0d1117] text-sm text-white`}
      >
        <code className={`language-${language}`}>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function MarkdownWithCopy({ content }: { content: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      components={{
        code(props) {
          return <CodeBlock {...props} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
