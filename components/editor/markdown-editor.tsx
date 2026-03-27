'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Content</label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {showPreview ? (
          <Card className="min-h-[400px] p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="prose prose-neutral dark:prose-invert max-w-none"
            >
              {value || '*No content yet*'}
            </ReactMarkdown>
          </Card>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Write your markdown here...'}
            className="min-h-[400px] font-mono text-sm"
          />
        )}
      </div>
      {!showPreview && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Live Preview</label>
          <Card className="min-h-[400px] max-h-[400px] overflow-y-auto p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="prose prose-neutral dark:prose-invert max-w-none"
            >
              {value || '*No content yet*'}
            </ReactMarkdown>
          </Card>
        </div>
      )}
    </div>
  );
}
