import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogPosts';
import { AdUnit } from '../components/AdUnit';

function findPost(slug: string) {
  return BLOG_POSTS.find(post => post.slug === slug);
}

// Generate URL-friendly slug from heading text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Extract headings from markdown content
interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({
      id: slugify(text),
      text,
      level,
    });
  }

  return headings;
}

// Table of Contents component
function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (headings.length < 3) return null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Table of Contents
        </h2>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <ul className="mt-4 space-y-2">
          {headings.map((heading, index) => (
            <li
              key={index}
              className={heading.level === 3 ? 'ml-4' : ''}
            >
              <button
                onClick={() => scrollToSection(heading.id)}
                className="text-left text-gray-600 hover:text-blue-600 transition-colors text-sm leading-relaxed hover:underline"
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

// Custom components for ReactMarkdown styling - Modern 2026 blog design
// Note: We need to create these dynamically to generate anchor IDs
const createMarkdownComponents = (): Components => ({
  h2: ({ children }) => {
    const text = typeof children === 'string' ? children : String(children);
    const id = slugify(text);
    return (
      <h2 id={id} className="text-2xl md:text-3xl font-bold text-gray-900 mt-14 mb-6 tracking-tight scroll-mt-20">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = typeof children === 'string' ? children : String(children);
    const id = slugify(text);
    return (
      <h3 id={id} className="text-xl md:text-2xl font-semibold text-gray-900 mt-10 mb-4 scroll-mt-20">
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p className="text-gray-700 text-lg leading-[1.8] my-6">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-6 space-y-3">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 space-y-3 list-none counter-reset-item">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-700 text-lg leading-[1.8] flex items-start gap-3">
      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-3"></span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 pl-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent py-6 pr-6 rounded-r-xl text-gray-700 text-lg italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-700 underline decoration-blue-200 hover:decoration-blue-500 underline-offset-2 transition-colors font-medium"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-5 py-4 text-left font-semibold text-gray-900 text-sm uppercase tracking-wide">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-5 py-4 text-gray-700 border-b border-gray-100">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-gray-50/50 transition-colors">{children}</tr>
  ),
  img: ({ src, alt }) => (
    <figure className="my-10">
      <img src={src} alt={alt} className="rounded-2xl w-full h-auto shadow-lg" loading="lazy" />
      {alt && <figcaption className="text-center text-gray-500 text-sm mt-3 italic">{alt}</figcaption>}
    </figure>
  ),
  hr: () => (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
  ),
  code: ({ children }) => (
    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm font-mono border border-gray-200">{children}</code>
  ),
});

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? findPost(slug) : undefined;

  // Extract headings for TOC
  const headings = useMemo(() => {
    if (!post) return [];
    return extractHeadings(post.content);
  }, [post]);

  // Memoize markdown components
  const markdownComponents = useMemo(() => createMarkdownComponents(), []);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Own vs Rent Blog`;

      // Meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.description);
      }

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `https://ownvsrent.io/blog/${post.slug}`);

      // Image URL (use featured image or fallback to site default)
      const imageUrl = post.featuredImage
        ? `https://ownvsrent.io${post.featuredImage}`
        : 'https://ownvsrent.io/og-image.png';

      // Open Graph tags (including image support for social sharing)
      const ogTags: { property?: string; name?: string; content: string }[] = [
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `https://ownvsrent.io/blog/${post.slug}` },
        { property: 'og:site_name', content: 'Own vs Rent' },
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: post.title },
        { property: 'article:published_time', content: post.date },
        { property: 'article:section', content: BLOG_CATEGORIES[post.category].label },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: post.title },
        { name: 'twitter:description', content: post.description },
        { name: 'twitter:image', content: imageUrl },
      ];

      ogTags.forEach(({ property, name, content }) => {
        const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
        let tag = document.querySelector(selector);
        if (!tag) {
          tag = document.createElement('meta');
          if (property) tag.setAttribute('property', property);
          if (name) tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Find related posts (same category, excluding current)
  const relatedPosts = BLOG_POSTS
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  // Word count for schema
  const wordCount = post.content.split(/\s+/).length;

  // Image URL for schema (use featured image or fallback to site default)
  const schemaImageUrl = post.featuredImage
    ? `https://ownvsrent.io${post.featuredImage}`
    : 'https://ownvsrent.io/og-image.png';

  // JSON-LD for article (enhanced for 2026 SEO)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": schemaImageUrl,
    "datePublished": post.date,
    "dateModified": post.date,
    "wordCount": wordCount,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ownvsrent.io/blog/${post.slug}`
    },
    "author": {
      "@type": "Organization",
      "name": "Own vs Rent",
      "url": "https://ownvsrent.io"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Own vs Rent",
      "url": "https://ownvsrent.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ownvsrent.io/logo.png"
      }
    },
    "articleSection": BLOG_CATEGORIES[post.category].label,
    "inLanguage": "en-US"
  };

  // JSON-LD for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ownvsrent.io"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://ownvsrent.io/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://ownvsrent.io/blog/${post.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/blog" className="hover:text-gray-600 transition-colors">Blog</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10 md:mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${BLOG_CATEGORIES[post.category].color}`}>
              {BLOG_CATEGORIES[post.category].label}
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">{post.readTime} read</span>
            <span className="text-sm text-gray-400">•</span>
            <time className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light">
            {post.description}
          </p>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 -mx-4 sm:mx-0">
            <img
              src={post.featuredImage}
              alt={post.title}
              loading="eager"
              decoding="async"
              className="w-full h-auto rounded-none sm:rounded-2xl object-cover max-h-[500px] shadow-lg"
            />
          </div>
        )}

        {/* Table of Contents */}
        <TableOfContents headings={headings} />

        {/* Content */}
        <div className="max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Ad */}
        <div className="my-14 flex justify-center">
          <AdUnit slot="9767282879" format="in-article" />
        </div>

        {/* CTA */}
        <div className="my-14 p-8 md:p-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),_transparent_50%)]"></div>
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Run Your Own Numbers
            </h3>
            <p className="text-gray-300 mb-8 text-lg max-w-md mx-auto">
              See exactly when buying beats renting for your specific situation.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              Use the Calculator
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Continue Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"
                >
                  {related.featuredImage && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img
                        src={related.featuredImage}
                        alt={related.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{related.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
