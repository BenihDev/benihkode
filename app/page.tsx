import Link from 'next/link';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appConfig } from '@/config/app.config';

async function getPosts() {
  if (!appConfig.features.posts) return [];
  return db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.published, true),
    orderBy: [desc(posts.publishedAt), desc(posts.createdAt)],
    limit: appConfig.content.itemsPerPage,
  });
}

export default async function Home() {
  const allPosts = await getPosts();

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">{appConfig.appTitle}</h1>
          <p className="text-muted-foreground">{appConfig.appTagline}</p>
        </div>
        {appConfig.features.posts && (
          <Button asChild>
            <Link href="/posts/new">New Post</Link>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {allPosts.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
            <p className="text-muted-foreground mb-4">
              Be the first to publish a post!
            </p>
            {appConfig.features.posts && (
              <Button asChild>
                <Link href="/posts/new">Create Post</Link>
              </Button>
            )}
          </Card>
        ) : (
          allPosts.map((post) => (
            <Card key={post.id} className="p-6">
              <Link href={`/posts/${post.slug}`} className="block">
                <h2 className="text-2xl font-bold mb-2 hover:text-primary">
                  {post.title}
                </h2>
                {appConfig.content.excerpts && post.excerpt && (
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                )}
                <div className="text-sm text-muted-foreground">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : new Date(post.createdAt).toLocaleDateString()}
                </div>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
