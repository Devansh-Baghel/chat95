import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-css";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-yaml";
// import "prismjs/components/prism-svelte";
// import "prismjs/components/prism-vue";

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      children={content}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : null;

          if (!inline && match && language && Prism.languages[language]) {
            // Language is supported, apply syntax highlighting
            return (
              <pre className={className} style={{ backgroundColor: "#282c34" }}>
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      String(children).replace(/\n$/, ""),
                      Prism.languages[language],
                      language
                    ),
                  }}
                />
              </pre>
            );
          } else if (!inline && match) {
            // Language is not supported, render without highlighting
            return (
              <pre className={className} style={{ backgroundColor: "#282c34" }}>
                <code {...props}>{children}</code>
              </pre>
            );
          } else {
            // Inline code
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        },
      }}
    />
  );
}
