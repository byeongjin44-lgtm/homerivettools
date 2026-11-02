import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";
import { BlogContent } from "@/components/blog/BlogContent";
import { pageMetadata } from "@/lib/page-metadata";
import { blogPath, getAllPosts, getPost, getPostTool } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

// Static export: only the posts present at build time exist.
export const dynamicParams = false;

/**
 * `output: "export"` refuses a dynamic route with no params. Until the first approved post is
 * published, build a single noindex placeholder page instead (not linked anywhere, not in the sitemap).
 */
const NO_POSTS_SLUG = "no-posts-yet";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: NO_POSTS_SLUG }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: `Blog — ${SITE_NAME}`, robots: { index: false, follow: true } };
  return pageMetadata({ title: `${post.title} — ${SITE_NAME}`, description: post.description, path: blogPath(post.slug) });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post && slug === NO_POSTS_SLUG && getAllPosts().length === 0) return <NoPostsYet />;
  if (!post) notFound();
  const tool = getPostTool(post);
  const url = `${SITE_URL}${blogPath(post.slug)}`;

  return (
    <Container className="flex flex-1 flex-col gap-8 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          url,
          mainEntityOfPage: url,
          datePublished: post.published,
          dateModified: post.updated ?? post.published,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <article className="flex max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>{" "}
            · <time dateTime={post.published}>{post.published}</time>
            {post.updated && post.updated !== post.published && (
              <>
                {" "}
                · Updated <time dateTime={post.updated}>{post.updated}</time>
              </>
            )}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            {post.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">{post.description}</p>
        </header>

        {tool && <TryTool name={tool.name} path={tool.path} description={tool.shortDescription} />}

        <BlogContent body={post.body} />

        <section className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Sources</h2>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {post.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="font-medium text-zinc-900 underline dark:text-zinc-50" rel="noopener noreferrer" target="_blank">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Figures are estimates. Always check the coverage or yield on the manufacturer&apos;s label before you buy.
          </p>
        </section>

        <AdSlot id="blog-bottom" />

        {tool && <TryTool name={tool.name} path={tool.path} description={tool.shortDescription} />}
      </article>
    </Container>
  );
}

function TryTool({ name, path, description }: { name: string; path: string; description: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{name}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
      <Link
        href={path}
        className="shrink-0 rounded-md bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Open the calculator →
      </Link>
    </div>
  );
}

function NoPostsYet() {
  return (
    <Container className="flex flex-1 flex-col gap-4 py-10 text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">No guides yet</h1>
      <p>
        Our first guides are on the way. Meanwhile, see the{" "}
        <Link href="/blog" className="font-medium text-zinc-900 underline dark:text-zinc-50">
          blog
        </Link>{" "}
        or try a calculator from the{" "}
        <Link href="/" className="font-medium text-zinc-900 underline dark:text-zinc-50">
          home page
        </Link>
        .
      </p>
    </Container>
  );
}
