import Link from "next/link";
import type { ToolDefinition } from "@/lib/site-config";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link
      href={tool.path}
      className="group flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-50"
    >
      <h3 className="flex items-center justify-between gap-2 text-lg font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
        {tool.name}
        <span aria-hidden="true" className="translate-x-0 text-zinc-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 dark:text-zinc-500">
          →
        </span>
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{tool.shortDescription}</p>
    </Link>
  );
}
