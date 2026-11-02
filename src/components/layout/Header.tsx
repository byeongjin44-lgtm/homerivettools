import Link from "next/link";
import { ToolsMenu } from "@/components/layout/ToolsMenu";
import { SITE_NAME } from "@/lib/site-config";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            className="rounded-md px-2 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Blog
          </Link>
          <ToolsMenu />
        </div>
      </div>
    </header>
  );
}
