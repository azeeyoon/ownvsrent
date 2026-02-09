import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogPosts';
import { AdUnit } from '../components/AdUnit';

function findPost(slug: string) {
  return BLOG_POSTS.find(post => post.slug === slug);
}

// Helper to process inline formatting (bold)
function formatInlineText(text: string, keyPrefix: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`${keyPrefix}-bold-${match.index}`} className="font-semibold text-gray-900">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Simple markdown-to-JSX converter for blog content
function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactElement[] = [];
  let currentList: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      const ListTag = listType === 'ol' ? 'ol' : 'ul';
      const listClass = listType === 'ol'
        ? 'list-decimal list-inside space-y-2 my-4 text-gray-600'
        : 'list-disc list-inside space-y-2 my-4 text-gray-600';
      elements.push(
        <ListTag key={elements.length} className={listClass}>
          {currentList.map((item, i) => (
            <li key={i}>{formatInlineText(item, `list-${elements.length}-${i}`)}</li>
          ))}
        </ListTag>
      );
      currentList = [];
      listType = null;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const body = tableRows.slice(2); // Skip header and separator
      elements.push(
        <div key={elements.length} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-2 bg-gray-100 text-left font-semibold text-gray-900 border border-gray-200">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 border border-gray-200 text-gray-600">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.includes('|') && line.trim().startsWith('|')) {
      if (!inTable) inTable = true;
      const cells = line.split('|').filter(c => c.trim() !== '');
      if (!line.includes('---')) {
        tableRows.push(cells);
      } else {
        tableRows.push([]); // Separator placeholder
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={elements.length} className="text-xl font-bold text-gray-900 mt-8 mb-4">
          {line.replace('## ', '')}
        </h2>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={elements.length} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      flushList();
      const quoteLines: string[] = [line.replace(/^>\s*/, '')];
      while (i + 1 < lines.length && lines[i + 1].startsWith('>')) {
        i++;
        quoteLines.push(lines[i].replace(/^>\s*/, ''));
      }
      elements.push(
        <blockquote key={elements.length} className="my-4 pl-4 border-l-4 border-blue-300 bg-blue-50 py-3 pr-4 rounded-r-lg text-gray-700 italic">
          {quoteLines.map((l, idx) => (
            <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{l}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith('- ')) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      currentList.push(line.replace('- ', ''));
      continue;
    }

    // Ordered list
    const orderedMatch = line.match(/^\d+\.\s/);
    if (orderedMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      currentList.push(line.replace(/^\d+\.\s/, ''));
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();

    elements.push(
      <p key={elements.length} className="text-gray-600 leading-relaxed my-4">
        {formatInlineText(line, `p-${elements.length}`)}
      </p>
    );
  }

  flushList();
  flushTable();

  return elements;
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? findPost(slug) : undefined;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Own vs Rent Blog`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.description);
      }
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Find related posts (same category, excluding current)
  const relatedPosts = BLOG_POSTS
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  // JSON-LD for article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "Own vs Rent"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Own vs Rent",
      "url": "https://ownvsrent.io"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-gray-700">Blog</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${BLOG_CATEGORIES[post.category].color}`}>
              {BLOG_CATEGORIES[post.category].label}
            </span>
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600">
            {post.description}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Ad */}
        <div className="my-10 flex justify-center">
          <AdUnit slot="9767282879" format="in-article" />
        </div>

        {/* CTA */}
        <div className="my-10 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-center">
          <h3 className="text-xl font-semibold text-white mb-3">
            Run Your Own Numbers
          </h3>
          <p className="text-gray-300 mb-6">
            See exactly when buying beats renting for your specific situation.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Use the Calculator
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <h4 className="font-medium text-gray-900 mb-1">{related.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
