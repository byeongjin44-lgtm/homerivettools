import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/page-metadata";
import { blogPath, getAllPosts, getPostTool } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `Home Project Material Guides — ${SITE_NAME} Blog`,
  description:
    "Practical guides to estimating materials for home and garden projects — paint, concrete, tile, flooring, mulch and more — each paired with a free calculator.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <Container className="flex flex-1 flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {SITE_NAME} Blog
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Short, practical guides to working out how much material a project needs. Each one links to a free
          calculator so you can run your own numbers.
        </p>
      </div>
      {posts.length === 0 && <p className="text-zinc-600 dark:text-zinc-400">The first guides are coming soon.</p>}
      <ul className="flex flex-col gap-4">
        {posts.map((post) => {
          const tool = getPostTool(post);
          return (
            <li
              key={post.slug}
              className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                <Link href={blogPath(post.slug)} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{post.description}</p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                <time dateTime={post.published}>{post.published}</time>
                {tool && <> · {tool.name}</>}
              </p>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
