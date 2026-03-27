import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { posts } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const [post] = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        published: published || false,
        authorId: session.user.id,
        publishedAt: published ? new Date() : null,
      })
      .returning();

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const publishedPosts = await db.query.posts.findMany({
      where: (posts, { eq }) => eq(posts.published, true),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: (posts, { desc }) => desc(posts.createdAt),
    });

    return NextResponse.json(publishedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
