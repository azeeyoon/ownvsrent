import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { guideSections } from '../content/guide-sections';

export function GuidePage() {
  useEffect(() => {
    document.title = 'Rent vs Buy Guide 2026: The Complete Analysis | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'The complete rent vs buy guide for 2026. Learn about the 5% rule, true costs of ownership, tax benefits, and how to decide whether to rent or buy a home.');
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Rent vs Buy in 2026: The Complete Guide
      </h1>
      <p className="text-gray-600 mb-8">
        Everything you need to know to make an informed decision about renting or buying a home.
      </p>

      {/* Table of Contents */}
      <nav className="mb-10 p-6 bg-gray-50 rounded-xl">
        <h2 className="font-semibold text-gray-900 mb-4">In This Guide</h2>
        <ol className="space-y-2">
          {guideSections.map((section, index) => (
            <li key={section.id} className="flex gap-3">
              <span className="text-gray-400 font-mono text-sm w-6">{index + 1}.</span>
              <a
                href={`#${section.id}`}
                className="text-gray-600 hover:text-gray-900"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content Sections */}
      <div className="space-y-16">
        {guideSections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="prose prose-gray max-w-none">
              {section.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('**') && paragraph.includes('**\n')) {
                  const [heading, ...rest] = paragraph.split('\n');
                  return (
                    <div key={i} className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {heading.replace(/\*\*/g, '')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {rest.join('\n')}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 p-8 bg-gray-900 rounded-xl text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Ready to see your numbers?
        </h3>
        <p className="text-gray-300 mb-6 max-w-lg mx-auto">
          Get a personalized rent vs buy analysis based on your specific situation, income, and local market.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Use the Calculator
        </Link>
      </div>

      {/* Related Links */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/methodology"
          className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1">How the Calculator Works</h4>
          <p className="text-sm text-gray-600">Learn about our month-by-month simulation methodology.</p>
        </Link>
        <Link
          to="/faq"
          className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1">Frequently Asked Questions</h4>
          <p className="text-sm text-gray-600">Quick answers to common rent vs buy questions.</p>
        </Link>
      </div>
    </div>
  );
}
