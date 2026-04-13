interface Props { content: string }

/**
 * Renders blog post content with Medium-style typography.
 * Supports: ## headings, > blockquotes, plain paragraphs.
 * No external markdown library needed.
 */
export default function ProseRenderer({ content }: Props) {
  const blocks = content.split("\n\n").map((b) => b.trim()).filter(Boolean);

  return (
    <div className="blog-prose space-y-6">
      {blocks.map((block, i) => {
        // ## Heading
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="blog-heading">
              {block.slice(3)}
            </h2>
          );
        }
        // > Blockquote
        if (block.startsWith("> ")) {
          return (
            <blockquote key={i} className="blog-quote">
              <p>{block.slice(2)}</p>
            </blockquote>
          );
        }
        // Plain paragraph
        return (
          <p key={i} className="blog-paragraph">
            {block}
          </p>
        );
      })}
    </div>
  );
}
