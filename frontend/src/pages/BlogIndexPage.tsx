import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogPosts';

export function BlogIndexPage() {
  useEffect(() => {
    document.title = 'Blog | Rent vs Buy Tips & Advice | Own vs Rent';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Expert tips on renting vs buying a home. Learn about hidden costs, negotiation strategies, and how to make the best housing decision for your situation.');
    }
  }, []);

  return (
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
            <article className="p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
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
              <p className="text-gray-600">
                {post.description}
              </p>
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
  );
}
