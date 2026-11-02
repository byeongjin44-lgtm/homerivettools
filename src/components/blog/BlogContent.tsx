import Link from "next/link";
import { parseInline, type BlogBlock } from "@/lib/blog";

const CODE_INLINE = "rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800";
const LINK = "font-medium text-zinc-900 underline dark:text-zinc-50";

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((seg, i) => {
        if (seg.kind === "code")
          return (
            <code key={i} className={CODE_INLINE}>
              {seg.value}
            </code>
          );
        if (seg.kind === "link")
          return seg.href.startsWith("/") ? (
            <Link key={i} href={seg.href} className={LINK}>
              {seg.value}
            </Link>
          ) : (
            <a key={i} href={seg.href} className={LINK} rel="noopener noreferrer" target="_blank">
              {seg.value}
            </a>
          );
        return <span key={i}>{seg.value}</span>;
      })}
    </>
  );
}

export function BlogContent({ body }: { body: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
      {body.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                <Inline text={block.text} />
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                <Inline text={block.text} />
              </h3>
            );
          case "p":
            return (
              <p key={i}>
                <Inline text={block.text} />
              </p>
            );
          case "ul":
          case "ol": {
            const ListTag = block.type;
            return (
              <ListTag key={i} className={`flex flex-col gap-1 pl-6 ${block.type === "ul" ? "list-disc" : "list-decimal"}`}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </ListTag>
            );
          }
          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-4 font-mono text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {block.text}
              </pre>
            );
        }
      })}
    </div>
  );
}
