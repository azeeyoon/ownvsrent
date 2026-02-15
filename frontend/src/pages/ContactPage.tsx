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
        <div className="max-w-md mb-16">
          {/* Email */}
          <a
            href="mailto:hello@ownvsrent.io"
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all group block"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600 mb-3">
              For bug reports, feature requests, general inquiries, or partnerships.
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
                Please send us an email at{' '}
                <a href="mailto:hello@ownvsrent.io" className="text-blue-600 hover:underline">
                  hello@ownvsrent.io
                </a>
                . Include what you expected vs. what happened, and if possible, share a link to the calculator with your inputs (the URL contains your settings).
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Can I suggest a new feature?</h3>
              <p className="text-gray-600">
                Absolutely! Send your feature requests to{' '}
                <a href="mailto:hello@ownvsrent.io" className="text-blue-600 hover:underline">
                  hello@ownvsrent.io
                </a>
                . We prioritize features that help users make better housing decisions.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">How can I support this project?</h3>
              <p className="text-gray-600">
                The best way to support us is to share ownvsrent.io with friends and family who are making housing decisions. Word of mouth helps us reach more people!
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
                We're a small team, so please allow 2-3 business days for a response. We read every email and will get back to you as soon as possible.
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
