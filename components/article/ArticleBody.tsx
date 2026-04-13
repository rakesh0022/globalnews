interface Props {
  content: string;
}

/**
 * Renders article body paragraphs with pull-quote detection.
 * Lines starting with `"` or `'` and ending with `"` or `'` are
 * rendered as styled pull-quotes.
 */
export default function ArticleBody({ content }: Props) {
  const paragraphs = content
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {paragraphs.map((para, i) => {
        const isQuote =
          (para.startsWith('"') && para.endsWith('"')) ||
          (para.startsWith("\u201C") && para.endsWith("\u201D"));

        if (isQuote) {
          return (
            <blockquote
              key={i}
              className="relative my-8 pl-6 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-xl py-3 pr-4"
            >
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed italic">
                {para}
              </p>
            </blockquote>
          );
        }

        // First paragraph gets slightly larger treatment (lede)
        if (i === 0) {
          return (
            <p
              key={i}
              className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-[1.85] font-normal"
            >
              {para}
            </p>
          );
        }

        return (
          <p
            key={i}
            className="text-base sm:text-[17px] text-gray-700 dark:text-gray-300 leading-[1.85]"
          >
            {para}
          </p>
        );
      })}
    </div>
  );
}
