'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/editor/markdown-editor';
import { toast } from 'sonner';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Debounced autosave function
  const autosave = useCallback(async () => {
    if (!formData.title && !formData.content) return;

    setAutoSaving(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: false,
        }),
      });

      if (!response.ok) throw new Error('Failed to autosave');

      const post = await response.json();
      if (!postId && post.id) {
        setPostId(post.id);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Autosave failed:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [formData, postId]);

  // Trigger autosave when form data changes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      autosave();
    }, 2000); // Autosave after 2 seconds of inactivity

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, autosave]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: publish,
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const post = await response.json();
      toast.success(publish ? 'Post published successfully!' : 'Draft saved successfully!');
      router.push(`/posts/${post.slug}`);
    } catch (error) {
      toast.error('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground">Write and publish your blog post</p>
        </div>
        {lastSaved && (
          <div className="text-sm text-muted-foreground">
            {autoSaving ? 'Saving...' : `Last saved: ${lastSaved.toLocaleTimeString()}`}
          </div>
        )}
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter post title..."
            className="text-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="post-url-slug"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Brief summary of the post..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
          <Input
            id="coverImage"
            value={formData.coverImage}
            onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <MarkdownEditor
          value={formData.content}
          onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
          placeholder="Write your post content in Markdown..."
        />

        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={loading || !formData.title}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={loading || !formData.title || !formData.content}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
