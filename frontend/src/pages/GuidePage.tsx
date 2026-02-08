import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { guideSectionsData } from '../components/content/GuideContent';

export function GuidePage() {
  useEffect(() => {
    document.title = 'Rent vs Buy Guide 2026: The Complete Analysis | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'The complete rent vs buy guide for 2026. Learn about the 5% rule, true costs of ownership, tax benefits, and how to decide whether to rent or buy a home.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Rent vs Buy in 2026
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            The complete guide to making the biggest financial decision of your life — with real math, not sales pitches.
          </p>
          <div className="flex items-center gap-6 mt-8 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              15 min read
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {guideSectionsData.length} sections
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            In This Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {guideSectionsData.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">
                  {section.icon}
                </span>
                <span className="text-gray-700 group-hover:text-blue-700 font-medium transition-colors">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* Content Sections */}
        <div className="space-y-8">
          {guideSectionsData.map((section, index) => {
            const SectionComponent = section.Component;
            return (
              <section
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-8"
              >
                {/* Section Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                      {section.icon}
                    </span>
                    <div>
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Part {index + 1}
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6">
                  <SectionComponent />
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to run your numbers?
            </h3>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Get a personalized rent vs buy analysis based on your specific situation, income, and local market.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Use the Calculator
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/methodology"
            className="group p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔬</span>
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                How the Calculator Works
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              Learn about our month-by-month simulation methodology and transparent math.
            </p>
          </Link>
          <Link
            to="/faq"
            className="group p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">❓</span>
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Frequently Asked Questions
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              Quick answers to common rent vs buy questions from our users.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
