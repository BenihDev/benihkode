import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
	}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		emoji: z.string(),
		techStack: z.array(z.string()),
		url: z.string().optional(),
		order: z.number().default(0),
		hasPrivacyPolicy: z.boolean().default(false),
		appName: z.string().optional(),
	}),
});

const ideas = defineCollection({
	loader: glob({ base: './src/content/ideas', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		status: z.enum(['idea', 'in-progress', 'completed']),
		meta: z.string().optional(),
		order: z.number().default(0),
	}),
});

export const collections = { blog, projects, ideas };
