import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogPosts';

export function BlogIndexPage() {
  useEffect(() => {
    document.title = 'Blog | Rent vs Buy Tips & Advice | Own vs Rent';

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Expert tips on renting vs buying a home. Learn about hidden costs, negotiation strategies, and how to make the best housing decision for your situation.');
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://ownvsrent.io/blog');

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'Rent vs Buy Blog | Own vs Rent' },
      { property: 'og:description', content: 'Expert tips on renting vs buying a home. Learn about hidden costs, negotiation strategies, and smart housing decisions.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://ownvsrent.io/blog' },
      { property: 'og:site_name', content: 'Own vs Rent' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Rent vs Buy Blog | Own vs Rent' },
      { name: 'twitter:description', content: 'Expert tips on renting vs buying a home.' },
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
  }, []);

  // JSON-LD for CollectionPage
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Rent vs Buy Blog",
    "description": "Expert tips on renting vs buying a home. Learn about hidden costs, negotiation strategies, and how to make the best housing decision for your situation.",
    "url": "https://ownvsrent.io/blog",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": BLOG_POSTS.length,
      "itemListElement": BLOG_POSTS.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://ownvsrent.io/blog/${post.slug}`,
        "name": post.title
      }))
    }
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
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Blog</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Rent vs Buy Blog
        </h1>
        <p className="text-gray-600 text-lg">
          Practical advice for making smarter housing decisions.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="space-y-6">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block group"
          >
            <article className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-full sm:w-48 h-32 sm:h-32 rounded-lg overflow-hidden">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    post.category === 'buying' ? 'bg-green-100' :
                    post.category === 'renting' ? 'bg-blue-100' :
                    post.category === 'investing' ? 'bg-purple-100' :
                    'bg-amber-100'
                  }`}>
                    <span className={`text-3xl ${
                      post.category === 'buying' ? 'text-green-400' :
                      post.category === 'renting' ? 'text-blue-400' :
                      post.category === 'investing' ? 'text-purple-400' :
                      'text-amber-400'
                    }`}>
                      {post.category === 'buying' ? '🏠' :
                       post.category === 'renting' ? '🔑' :
                       post.category === 'investing' ? '📈' :
                       '💡'}
                    </span>
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${BLOG_CATEGORIES[post.category].color}`}>
                    {BLOG_CATEGORIES[post.category].label}
                  </span>
                  <span className="text-sm text-gray-500">{post.readTime} read</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-2">
                  {post.description}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 p-8 bg-gray-50 rounded-2xl text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Ready to run your numbers?
        </h3>
        <p className="text-gray-600 mb-6">
          Use our free calculator to see whether renting or buying makes sense for your situation.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try the Calculator
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
    </>
  );
}
