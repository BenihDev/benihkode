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
		summary: z.string().optional(),
		emoji: z.string(),
		techStack: z.array(z.string()),
		category: z.enum(['tool', 'app']).default('app'),
		icon: z.string().optional(),
		url: z.string().optional(),
		npmPackage: z.string().optional(),
		githubUrl: z.string().optional(),
		installCommand: z.string().optional(),
		order: z.number().default(0),
		// Single marker for an App that ships through an app store. The
		// store-facing pages hang off it: support at /apps/<slug>/support, the
		// privacy policy at /apps/<slug>/privacy, and the old /projects URLs
		// forwarded by scripts/gen-redirects.mjs. A hand-written page at the
		// same URL is the escape hatch — the generated route steps aside for it.
		distributed: z.boolean().default(false),
		appName: z.string().optional(),
	}),
});

// Long-form per-App page content, keyed by the Project slug:
// src/content/app-pages/<slug>.md. Short metadata stays in the projects
// frontmatter; these documents hold the copy the generated App pages render.
// <slug>.md is the privacy clauses for /apps/<slug>/privacy and
// <slug>-support.md is the support copy for /apps/<slug>/support — the page
// templates own the header and the contact sections, so documents never
// hardcode the contact address. (A dash, not a dot, keeps the loader's
// generated id predictable.)
const appPages = defineCollection({
	loader: glob({ base: './src/content/app-pages', pattern: '**/*.{md,mdx}' }),
	schema: z.object({}),
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

export const collections = { blog, projects, ideas, appPages };
