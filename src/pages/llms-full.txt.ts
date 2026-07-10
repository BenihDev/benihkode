import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const siteUrl = (context.site?.toString() || 'https://benihkode.web.id').replace(/\/$/, '');
  
  const posts = (await getCollection('blog'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    
  const projects = (await getCollection('projects'))
    .sort((a, b) => b.data.order - a.data.order);
    
  const ideas = (await getCollection('ideas'))
    .sort((a, b) => b.data.order - a.data.order);

  const lines: string[] = [
    `# ${SITE_TITLE}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `> Complete details of all blog posts, projects, and ideas. Total: ${posts.length} articles, ${projects.length} projects, ${ideas.length} ideas.`,
    '',
  ];

  lines.push('## Blog Posts', '');
  for (const post of posts) {
    const url = `${siteUrl}/blog/${post.id}/`;
    const date = post.data.pubDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    lines.push(`### ${post.data.title}`, '', post.data.description, '');
    lines.push(`URL: ${url}`);
    lines.push(`Published: ${date}`);
    if (post.data.tags?.length) lines.push(`Tags: ${post.data.tags.join(', ')}`);
    lines.push('');
  }

  lines.push('## Projects', '');
  for (const project of projects) {
    const url = `${siteUrl}/projects/${project.id}/`;
    lines.push(`### ${project.data.emoji} ${project.data.title}`, '', project.data.description, '');
    lines.push(`URL: ${url}`);
    lines.push(`Category: ${project.data.category}`);
    if (project.data.techStack?.length) lines.push(`Tech Stack: ${project.data.techStack.join(', ')}`);
    if (project.data.url) lines.push(`Live URL: ${project.data.url}`);
    if (project.data.githubUrl) lines.push(`GitHub: ${project.data.githubUrl}`);
    lines.push('');
  }

  lines.push('## Ideas', '');
  for (const idea of ideas) {
    const url = `${siteUrl}/ideas/${idea.id}/`;
    lines.push(`### ${idea.data.title}`, '', idea.data.description, '');
    lines.push(`URL: ${url}`);
    lines.push(`Status: ${idea.data.status}`);
    if (idea.data.meta) lines.push(`Meta: ${idea.data.meta}`);
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
