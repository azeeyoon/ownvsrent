import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  useEffect(() => {
    document.title = 'About Us | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn about ownvsrent.io - a free, unbiased rent vs buy calculator built to help you make smarter housing decisions with transparent math.');
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-slate-300">About</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Own vs Rent
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            A free calculator built to help you make one of life's biggest financial decisions — with real math, not sales pitches.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mission */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              🎯
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Buying vs. renting is one of the most important financial decisions you'll ever make. Yet most "calculators" online are built by mortgage companies or real estate agents who have a vested interest in getting you to buy.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>We built ownvsrent.io to be different.</strong> Our calculator is completely free, has no hidden agenda, and shows you the honest math — even when the answer is "keep renting."
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-gray-900">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Unbiased Results</h3>
              <p className="text-sm text-gray-600">
                We don't favor buying or renting. If the math says rent, we say rent. No hidden assumptions pushing you toward homeownership.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Transparent Math</h3>
              <p className="text-sm text-gray-600">
                Every formula is explained in our <Link to="/methodology" className="text-blue-600 hover:underline">methodology</Link>. We show our work so you can verify our calculations.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Current Tax Law</h3>
              <p className="text-sm text-gray-600">
                We model 2026 tax law accurately, including the updated SALT caps, mortgage interest deduction limits, and PMI deductibility rules.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-sm text-gray-600">
                Your financial data never leaves your browser. All calculations happen locally — we never see or store your numbers.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
              🔧
            </div>
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Our calculator runs a month-by-month simulation comparing two scenarios: buying a home or renting and investing the difference. We account for:
            </p>
            <ul className="list-none text-gray-600 space-y-2 mt-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-xs font-semibold text-purple-700">1</span>
                <span>Mortgage amortization (principal vs. interest over time)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-xs font-semibold text-purple-700">2</span>
                <span>Home appreciation and investment returns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-xs font-semibold text-purple-700">3</span>
                <span>Tax benefits (and when they actually apply)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-xs font-semibold text-purple-700">4</span>
                <span>All ownership costs: property tax, insurance, maintenance, HOA, PMI</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-xs font-semibold text-purple-700">5</span>
                <span>Transaction costs when selling (realtor fees, closing costs)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-xs font-semibold text-purple-700">6</span>
                <span>Capital gains tax (with exemptions for primary residence)</span>
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              For the full details, check out our <Link to="/methodology" className="text-blue-600 hover:underline">methodology page</Link>.
            </p>
          </div>
        </div>

        {/* Who We Are */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
              👋
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Who We Are</h2>
          </div>
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              We're a small team of software engineers and personal finance enthusiasts who got frustrated with the biased calculators available online. After seeing too many people make the "buy vs rent" decision based on bad math or emotional pressure, we decided to build something better.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We built this project with transparency in mind. We fund the site through non-intrusive advertising, which allows us to keep it free for everyone.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to run your numbers?
            </h3>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              Get a personalized rent vs buy analysis in seconds. It's free, private, and unbiased.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
              >
                Use the Calculator
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
