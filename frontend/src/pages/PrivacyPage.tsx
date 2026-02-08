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
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: February 8, 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
          <p className="text-gray-600 leading-relaxed">
            ownvsrent.io ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our rent vs. buy calculator website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>

          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Calculator Data</h3>
          <p className="text-gray-600 leading-relaxed">
            All calculations are performed locally in your browser. The financial data you enter into our calculator (home price, rent, income, etc.) is <strong>never sent to our servers</strong> and is not stored anywhere. When you close or refresh the page, this data is gone.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Analytics Data</h3>
          <p className="text-gray-600 leading-relaxed">
            We use Google Analytics to understand how visitors use our site. This collects anonymous data such as:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Pages visited and time spent on site</li>
            <li>Device type and browser</li>
            <li>Geographic region (country/city level)</li>
            <li>Referral source (how you found us)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            This data is aggregated and cannot be used to identify you personally.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Email Subscription</h3>
          <p className="text-gray-600 leading-relaxed">
            If you voluntarily subscribe to our email list, we collect your email address and optionally your zip code. We use this information solely to send you rent vs. buy insights and updates. You can unsubscribe at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Advertising</h2>
          <p className="text-gray-600 leading-relaxed">
            We display advertisements through Google AdSense. Google and its partners may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              Google's Ads Settings
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            We use cookies for:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li><strong>Analytics:</strong> To understand site usage patterns</li>
            <li><strong>Advertising:</strong> To display relevant ads via Google AdSense</li>
            <li><strong>Preferences:</strong> To remember your calculator settings via URL parameters (not cookies)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            You can control cookies through your browser settings. Disabling cookies may affect site functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Links</h2>
          <p className="text-gray-600 leading-relaxed">
            Our site may contain links to third-party websites, including mortgage rate comparison sites. These links may be affiliate links, meaning we may earn a commission if you click through and take action. These third-party sites have their own privacy policies, and we are not responsible for their practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            Since we don't collect or store your financial calculator data, there is no risk of that data being breached. For any data we do collect (email subscriptions), we use industry-standard security measures to protect it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Children's Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us through our GitHub repository.
          </p>
        </section>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">Ready to run your numbers?</h3>
        <p className="text-gray-600 mb-4">
          Your data stays in your browser. Always.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Use the Calculator
        </Link>
      </div>
    </div>
  );
}
