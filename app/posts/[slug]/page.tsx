import { notFound } from 'next/navigation';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      createdAt: posts.createdAt,
      publishedAt: posts.publishedAt,
      author: {
        id: posts.authorId,
        // Note: We'd need to join with users table to get author details
        // For now, we'll use a simpler query
      },
    })
    .from(posts)
    .where(eq(posts.slug, params.slug))
    .limit(1);

  if (!post) {
    notFound();
  }

  return (
    <article className="container max-w-4xl py-8">
      {post.coverImage && (
        <div className="mb-8 aspect-video overflow-hidden rounded-lg">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          {post.publishedAt
            ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
            : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: PostPageProps) {
  const [post] = await db
    .select({ title: posts.title, excerpt: posts.excerpt })
    .from(posts)
    .where(eq(posts.slug, params.slug))
    .limit(1);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
  };
}
