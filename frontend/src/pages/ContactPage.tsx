import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get in touch with the ownvsrent.io team. Report bugs, suggest features, or ask questions about our rent vs buy calculator.');
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
            <span className="text-slate-300">Contact</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Have a question, found a bug, or want to suggest a feature? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* GitHub */}
          <a
            href="https://github.com/azeeyoon/ownvsrent/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">GitHub Issues</h3>
            <p className="text-sm text-gray-600 mb-3">
              The best way to report bugs, request features, or ask technical questions.
            </p>
            <span className="text-blue-600 text-sm font-medium group-hover:underline">
              Open an issue →
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:hello@ownvsrent.io"
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600 mb-3">
              For general inquiries, partnerships, or anything else.
            </p>
            <span className="text-blue-600 text-sm font-medium group-hover:underline">
              hello@ownvsrent.io →
            </span>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">How do I report a bug in the calculator?</h3>
              <p className="text-gray-600">
                Please open an issue on our{' '}
                <a href="https://github.com/azeeyoon/ownvsrent/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub repository
                </a>
                . Include what you expected vs. what happened, and if possible, share a link to the calculator with your inputs (the URL contains your settings).
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Can I suggest a new feature?</h3>
              <p className="text-gray-600">
                Absolutely! Feature requests are welcome on our GitHub Issues page. We prioritize features that help users make better housing decisions.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Is the calculator's code open source?</h3>
              <p className="text-gray-600">
                Yes! You can view and contribute to the code on{' '}
                <a href="https://github.com/azeeyoon/ownvsrent" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub
                </a>
                . We welcome contributions from the community.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">How can I support this project?</h3>
              <p className="text-gray-600">
                The best way to support us is to share ownvsrent.io with friends and family who are making housing decisions. If you're a developer, consider contributing on GitHub!
              </p>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 mb-16">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
              ⏱️
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
              <p className="text-gray-600">
                We're a small team, so please allow 2-3 business days for a response. For urgent bugs, GitHub Issues is the fastest way to reach us.
              </p>
            </div>
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
              See exactly when buying beats renting for your specific situation.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
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
