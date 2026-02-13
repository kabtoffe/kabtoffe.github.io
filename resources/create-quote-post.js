#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

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

function fetchMetadataFromUrl(url) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve({}), 5000);

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        clearTimeout(timeout);
        const metadata = {};

        // Extract author
        const authorPatterns = [
          /<meta\s+name="author"\s+content="([^"]*)"/i,
          /<meta\s+property="article:author"\s+content="([^"]*)"/i,
          /<meta\s+name="creator"\s+content="([^"]*)"/i,
          /<meta\s+property="og:author"\s+content="([^"]*)"/i,
        ];

        for (const pattern of authorPatterns) {
          const match = data.match(pattern);
          if (match && match[1]) {
            metadata.author = match[1].trim();
            break;
          }
        }

        // Fallback: try to get site name for author
        if (!metadata.author) {
          const siteNamePatterns = [
            /<meta\s+property="og:site_name"\s+content="([^"]*)"/i,
            /<meta\s+name="application-name"\s+content="([^"]*)"/i,
            /<meta\s+name="apple-mobile-web-app-title"\s+content="([^"]*)"/i,
          ];

          for (const pattern of siteNamePatterns) {
            const siteMatch = data.match(pattern);
            if (siteMatch && siteMatch[1]) {
              metadata.author = siteMatch[1].trim();
              break;
            }
          }
        }

        // Extract title
        const titlePatterns = [
          /<meta\s+property="og:title"\s+content="([^"]*)"/i,
          /<meta\s+property="twitter:title"\s+content="([^"]*)"/i,
          /<meta\s+name="title"\s+content="([^"]*)"/i,
        ];

        for (const pattern of titlePatterns) {
          const match = data.match(pattern);
          if (match && match[1]) {
            metadata.title = match[1].trim();
            break;
          }
        }

        // Fallback: extract from <title> tag if no meta title found
        if (!metadata.title) {
          const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            metadata.title = titleMatch[1].trim();
          }
        }

        // Extract date
        const datePatterns = [
          /<meta\s+property="article:published_time"\s+content="([^"]*)"/i,
          /<meta\s+property="datePublished"\s+content="([^"]*)"/i,
          /<meta\s+name="publish_date"\s+content="([^"]*)"/i,
          /<meta\s+name="date"\s+content="([^"]*)"/i,
        ];

        for (const pattern of datePatterns) {
          const match = data.match(pattern);
          if (match && match[1]) {
            const dateStr = match[1].trim();
            // Parse ISO format date (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)
            const datePart = dateStr.split('T')[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
              metadata.date = datePart;
              break;
            }
          }
        }

        // Extract tags from article:tag meta tags
        const tagMatches = data.match(/<meta\s+property="article:tag"\s+content="([^"]*)"/gi);
        const tags = [];
        if (tagMatches) {
          for (const match of tagMatches) {
            const tagMatch = match.match(/content="([^"]*)"/i);
            if (tagMatch && tagMatch[1]) {
              tags.push(tagMatch[1].trim());
            }
          }
        }
        if (tags.length > 0) {
          metadata.tags = tags.join(',');
        }

        resolve(metadata);
      });
    }).on('error', () => {
      clearTimeout(timeout);
      resolve({});
    });
  });
}

function validateParams(params) {
  const required = ['url'];
  const missing = required.filter(field => !params[field]);

  if (missing.length > 0) {
    console.error(`Error: Missing required parameters: ${missing.join(', ')}`);
    console.error('\nUsage: node tools/create-quote-post.js \\');
    console.error('  --url "https://example.com/article" \\');
    console.error('  --author "Author Name" (optional - will fetch from URL if not provided) \\');
    console.error('  --title "Article Title" (optional - will fetch from URL if not provided) \\');
    console.error('  --date "2026-02-07" (optional - will fetch from URL if not provided) \\');
    console.error('  --quote "The quote text" (optional if commentary provided) \\');
    console.error('  --commentary "Your commentary" (optional if quote provided)');
    return false;
  }

  // At least one of quote or commentary must be provided
  if (!params.quote && !params.commentary) {
    console.error('Error: At least one of --quote or --commentary is required');
    console.error('\nUsage: node tools/create-quote-post.js \\');
    console.error('  --author "Author Name" (optional - will fetch from URL if not provided) \\');
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
title: "Quoting ${params.author} - ${params.title}"
date: ${todayDate}
tags:
${tagsYAML}
source_author: "${params.author}"
source_url: "${params.url}"
source_date: "${sourceDate}"
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

async function main() {
  const params = parseArgs();

  if (!validateParams(params)) {
    process.exit(1);
  }

  // Fetch metadata from URL if any required fields are missing
  const needsFetch = !params.author || params.author === 'Unknown' || !params.title || !params.date || !params.tags;

  if (needsFetch) {
    console.log('Fetching metadata from URL...');
    const metadata = await fetchMetadataFromUrl(params.url);

    // Populate author if not provided or is "Unknown"
    if (!params.author || params.author === 'Unknown') {
      if (metadata.author) {
        params.author = metadata.author;
        console.log(`✓ Found author: ${metadata.author}`);
      } else {
        params.author = 'Unknown';
        console.log('⚠ Could not fetch author, using "Unknown"');
      }
    }

    // Populate title if not provided
    if (!params.title) {
      if (metadata.title) {
        params.title = metadata.title;
        console.log(`✓ Found title: ${metadata.title}`);
      } else {
        console.error('Error: Could not fetch title from URL and no --title provided');
        process.exit(1);
      }
    }

    // Populate date if not provided
    if (!params.date && metadata.date) {
      params.date = metadata.date;
      console.log(`✓ Found date: ${metadata.date}`);
    }

    // Populate tags if not provided
    if (!params.tags && metadata.tags) {
      params.tags = metadata.tags;
      console.log(`✓ Found tags: ${metadata.tags}`);
    }
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
