#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Create a quote post
 * Usage: node tools/create-quote-post.js --author "Ben Thompson" --url "https://..." --title "Article Title" --date "2026-02-07" --quote "The quote..." --commentary "Your commentary..."
 */

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    if (value) params[key] = value;
  }

  return params;
}

function validateParams(params) {
  const required = ['author', 'url', 'title'];
  const missing = required.filter(field => !params[field]);

  if (missing.length > 0) {
    console.error(`Error: Missing required parameters: ${missing.join(', ')}`);
    console.error('\nUsage: node tools/create-quote-post.js \\');
    console.error('  --author "Author Name" \\');
    console.error('  --url "https://example.com/article" \\');
    console.error('  --title "Article Title" \\');
    console.error('  --date "2026-02-07" \\');
    console.error('  --quote "The quote text" (optional if commentary provided) \\');
    console.error('  --commentary "Your commentary" (optional if quote provided)');
    return false;
  }

  // At least one of quote or commentary must be provided
  if (!params.quote && !params.commentary) {
    console.error('Error: At least one of --quote or --commentary is required');
    console.error('\nUsage: node tools/create-quote-post.js \\');
    console.error('  --author "Author Name" \\');
    console.error('  --url "https://example.com/article" \\');
    console.error('  --title "Article Title" \\');
    console.error('  --date "2026-02-07" \\');
    console.error('  --quote "The quote text" (optional if commentary provided) \\');
    console.error('  --commentary "Your commentary" (optional if quote provided)');
    return false;
  }

  return true;
}

function generateFilename(author, title) {
  // Format: Author-Title.md
  const sanitized = `${author}-${title}`
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single

  return `${sanitized}.md`;
}

function formatDatePretty(dateStr) {
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function generatePostContent(params) {
  // Post is always created with today's date
  const todayDate = new Date().toISOString().split('T')[0];
  // Article's original publication date
  const sourceDate = params.date;

  // Build tags list: always include "Quote", plus any additional tags
  let tags = ['Quote'];
  if (params.tags) {
    const additionalTags = params.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && tag !== 'Quote');
    tags = [...tags, ...additionalTags];
  }

  // Format tags as YAML list
  const tagsYAML = tags.map(tag => `  - ${tag}`).join('\n');

  const frontmatter = `---
title: Quoting ${params.author} - ${params.title}
date: ${todayDate}
tags:
${tagsYAML}
source_author: ${params.author}
source_url: ${params.url}
source_date: ${sourceDate}
---`;

  const dateStr = params.date ? ` (published ${formatDatePretty(params.date)})` : '';

  let quoteSection = '';
  if (params.quote) {
    quoteSection = `> ${params.quote.split('\n').join('\n> ')}\n\n`;
  }

  const content = `${params.author} in the article [${params.title}](${params.url})${dateStr}:

${quoteSection}${params.commentary || ''}
`;

  return `${frontmatter}\n\n${content}\n`;
}

function createPost(filename, content) {
  const postsDir = path.join(__dirname, '..', 'source', '_posts');
  const filepath = path.join(postsDir, filename);

  // Check if file already exists
  if (fs.existsSync(filepath)) {
    console.error(`Error: Post already exists at ${filepath}`);
    process.exit(1);
  }

  // Create posts directory if it doesn't exist
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(filepath, content, 'utf8');

  return filepath;
}

function main() {
  const params = parseArgs();

  if (!validateParams(params)) {
    process.exit(1);
  }

  const filename = generateFilename(params.author, params.title);
  const content = generatePostContent(params);

  try {
    const filepath = createPost(filename, content);
    const todayDate = new Date().toISOString().split('T')[0];
    console.log(`✓ Post created: ${filepath}`);
    console.log(JSON.stringify({
      success: true,
      filename: filename,
      filepath: filepath,
      date: todayDate,
      source_date: params.date
    }));
  } catch (error) {
    console.error(`Error creating post: ${error.message}`);
    process.exit(1);
  }
}

main();
