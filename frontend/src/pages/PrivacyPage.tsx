import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Privacy policy for ownvsrent.io rent vs buy calculator. Learn how we handle your data.');
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
            <span className="text-slate-300">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Your financial data stays in your browser. We believe in transparency about how we handle your information.
          </p>
          <div className="flex items-center gap-6 mt-8 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Last updated: February 8, 2026
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Key Privacy Points */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              🔒
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Local Processing</h3>
            <p className="text-sm text-gray-600">
              Calculator data never leaves your browser. All calculations happen locally.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Anonymous Analytics</h3>
            <p className="text-sm text-gray-600">
              We track usage patterns to improve the site, but never your personal data.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              🎯
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Hidden Tracking</h3>
            <p className="text-sm text-gray-600">
              We're transparent about what we collect. No surprises.
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="prose prose-lg prose-gray max-w-none space-y-12">
          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                👋
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Overview</h2>
            </div>
            <p className="text-gray-600 leading-relaxed m-0">
              ownvsrent.io ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our rent vs. buy calculator website.
            </p>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                📝
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
            </div>

            <div className="space-y-6 pl-14">
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Calculator Data
                </h3>
                <p className="text-gray-600 leading-relaxed m-0">
                  All calculations are performed locally in your browser. The financial data you enter into our calculator (home price, rent, income, etc.) is <strong>never sent to our servers</strong> and is not stored anywhere. When you close or refresh the page, this data is gone.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Analytics Data
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We use Google Analytics to understand how visitors use our site. This collects anonymous data such as:
                </p>
                <ul className="list-none text-gray-600 mt-3 space-y-2 m-0">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pages visited and time spent on site
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Device type and browser
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Geographic region (country/city level)
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Referral source (how you found us)
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3 m-0 text-sm">
                  This data is aggregated and cannot be used to identify you personally.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Email Subscription
                </h3>
                <p className="text-gray-600 leading-relaxed m-0">
                  If you voluntarily subscribe to our email list, we collect your email address and optionally your zip code. We use this information solely to send you rent vs. buy insights and updates. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                📢
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Advertising</h2>
            </div>
            <div className="pl-14">
              <p className="text-gray-600 leading-relaxed">
                We display advertisements through Google AdSense. Google and its partners may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Google's Ads Settings
                </a>.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                🍪
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Cookies</h2>
            </div>
            <div className="pl-14">
              <p className="text-gray-600 leading-relaxed">
                We use cookies for:
              </p>
              <ul className="list-none text-gray-600 mt-3 space-y-2">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold">1</span>
                  <span><strong>Analytics:</strong> To understand site usage patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold">2</span>
                  <span><strong>Advertising:</strong> To display relevant ads via Google AdSense</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold">3</span>
                  <span><strong>Preferences:</strong> To remember your calculator settings via URL parameters (not cookies)</span>
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4 text-sm">
                You can control cookies through your browser settings. Disabling cookies may affect site functionality.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                🔗
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Third-Party Links</h2>
            </div>
            <div className="pl-14">
              <p className="text-gray-600 leading-relaxed">
                Our site may contain links to third-party websites, including mortgage rate comparison sites. These links may be affiliate links, meaning we may earn a commission if you click through and take action. These third-party sites have their own privacy policies, and we are not responsible for their practices.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                🛡️
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Data Security</h2>
            </div>
            <div className="pl-14">
              <p className="text-gray-600 leading-relaxed">
                Since we don't collect or store your financial calculator data, there is no risk of that data being breached. For any data we do collect (email subscriptions), we use industry-standard security measures to protect it.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                👶
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Children's Privacy</h2>
            </div>
            <div className="pl-14">
              <p className="text-gray-600 leading-relaxed">
                Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                📋
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Changes to This Policy</h2>
            </div>
            <div className="pl-14">
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                ✉️
              </span>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Contact Us</h2>
            </div>
            <div className="pl-14">
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us through our GitHub repository.
              </p>
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to run your numbers?
            </h3>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              Your data stays in your browser. Always. Get a personalized rent vs buy analysis in seconds.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
            >
              Use the Calculator
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
