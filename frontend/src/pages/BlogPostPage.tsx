import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogPosts';
import { AdUnit } from '../components/AdUnit';

function findPost(slug: string) {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? findPost(slug) : undefined;

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

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 -mx-4 sm:mx-0">
            <img
              src={post.featuredImage}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-none sm:rounded-xl object-cover max-h-96"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-4 prose-li:text-gray-600 prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:py-3 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-table:text-sm prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-gray-200 prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200 prose-img:rounded-lg prose-img:my-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
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
