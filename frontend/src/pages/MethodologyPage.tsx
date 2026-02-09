import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { methodologySectionsData } from '../components/content/MethodologyContent';

export function MethodologyPage() {
  useEffect(() => {
    document.title = 'How Our Rent vs Buy Calculator Works | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn exactly how our rent vs buy calculator works. Month-by-month simulation, accurate tax calculations, and transparent methodology.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-emerald-300 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-emerald-200">Methodology</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How the Calculator Works
          </h1>
          <p className="text-xl text-emerald-200 max-w-2xl">
            A detailed look at the math behind our rent vs buy calculations. No black boxes — just transparent, auditable formulas.
          </p>
          <div className="flex items-center gap-6 mt-8 text-sm text-emerald-300">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Month-by-month simulation
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2026 tax law compliant
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            What's Covered
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {methodologySectionsData.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">
                  {section.icon}
                </span>
                <span className="text-gray-700 group-hover:text-emerald-700 font-medium transition-colors">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* Key Differentiators */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl mb-3">
              📊
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Month-by-Month</h3>
            <p className="text-sm text-gray-600">
              No annual shortcuts. We simulate each month individually for maximum accuracy.
            </p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl mb-3">
              📋
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Real Tax Math</h3>
            <p className="text-sm text-gray-600">
              Standard vs itemized comparison. Most calculators overstate tax benefits.
            </p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl mb-3">
              ⚖️
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Fair Comparison</h3>
            <p className="text-sm text-gray-600">
              Both scenarios can invest surpluses. No bias toward buying or renting.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {methodologySectionsData.map((section, index) => {
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
                    <span className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
                      {section.icon}
                    </span>
                    <div>
                      <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                        Section {index + 1}
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
        <div className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              See the methodology in action
            </h3>
            <p className="text-emerald-200 mb-8 max-w-lg mx-auto">
              Run your own numbers through our calculator and see exactly how each factor affects your outcome.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-900 font-semibold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Try the Calculator
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/guide"
            className="group p-5 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📚</span>
              <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                Complete Rent vs Buy Guide
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              Learn all the factors that affect the rent vs buy decision, explained in plain English.
            </p>
          </Link>
          <Link
            to="/faq"
            className="group p-5 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">❓</span>
              <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
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
