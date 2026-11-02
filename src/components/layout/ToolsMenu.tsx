"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { TOOL_GROUPS } from "@/lib/site-config";

export function ToolsMenu() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function close() {
      if (ref.current) ref.current.open = false;
    }
    function handlePointerDown(e: PointerEvent) {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) close();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && ref.current?.open) {
        close();
        ref.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <details ref={ref} className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-zinc-700 transition-colors select-none hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 [&::-webkit-details-marker]:hidden">
        Calculators
        <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <nav
        aria-label="Calculators"
        className="absolute right-0 z-20 mt-2 grid w-[min(36rem,calc(100vw-2rem))] gap-x-6 gap-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {TOOL_GROUPS.map((group) => (
          <div key={group.category} className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              {group.category}
            </p>
            <ul className="flex flex-col">
              {group.tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={tool.path}
                    onClick={() => {
                      if (ref.current) ref.current.open = false;
                    }}
                    className="block rounded px-1 py-1 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </details>
  );
}
