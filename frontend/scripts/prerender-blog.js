/**
 * Prerender blog pages for SEO and Medium import compatibility
 *
 * This script:
 * 1. Starts a preview server
 * 2. Uses Puppeteer to render each blog page
 * 3. Saves static HTML to dist/blog/[slug]/index.html
 *
 * Run after build: node scripts/prerender-blog.js
 */

import puppeteer from 'puppeteer';
import { preview } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

// Extract blog slugs from source file
async function getBlogSlugs() {
  const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blogPosts.ts');
  const content = await fs.readFile(blogPostsPath, 'utf-8');

  // Extract slugs using regex
  const slugMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const slugs = [];
  for (const match of slugMatches) {
    // Skip the interface definition
    if (match[1] !== 'string') {
      slugs.push(match[1]);
    }
  }
  return slugs;
}

async function prerender() {
  console.log('🚀 Starting prerender...\n');

  // Check if dist exists
  const distExists = await fs.access(distDir).then(() => true).catch(() => false);
  if (!distExists) {
    console.log('❌ dist/ folder not found. Run `npm run build` first.\n');
    process.exit(1);
  }

  // Get blog slugs
  const slugs = await getBlogSlugs();
  console.log(`📝 Found ${slugs.length} blog posts to prerender\n`);

  // Start Vite preview server
  const previewServer = await preview({
    root: path.join(__dirname, '..'),
    preview: {
      port: 4173,
      open: false,
    },
  });

  const baseUrl = `http://localhost:${previewServer.config.preview.port}`;
  console.log(`🌐 Preview server running at ${baseUrl}\n`);

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    // Prerender each blog post
    for (const slug of slugs) {
      const url = `${baseUrl}/blog/${slug}`;
      console.log(`  Rendering: /blog/${slug}`);

      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait for blog content to render
        await page.waitForSelector('article', { timeout: 10000 });

        // Get the full HTML
        const html = await page.content();

        // Save to dist/blog/[slug]/index.html
        const outputDir = path.join(distDir, 'blog', slug);
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(path.join(outputDir, 'index.html'), html);

        console.log(`  ✓ Saved: dist/blog/${slug}/index.html`);
      } catch (error) {
        console.error(`  ✗ Failed: ${slug} - ${error.message}`);
      }
    }

    // Also prerender the blog index page
    console.log(`\n  Rendering: /blog`);
    try {
      await page.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('main', { timeout: 10000 });
      const blogIndexHtml = await page.content();
      await fs.writeFile(path.join(distDir, 'blog', 'index.html'), blogIndexHtml);
      console.log(`  ✓ Saved: dist/blog/index.html`);
    } catch (error) {
      console.error(`  ✗ Failed: blog index - ${error.message}`);
    }

  } finally {
    await browser.close();
    previewServer.httpServer.close();
  }

  console.log('\n✅ Prerender complete!\n');
  console.log('Blog pages now have static HTML that Medium can import.');
  console.log('Deploy dist/ to S3 as usual.\n');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
