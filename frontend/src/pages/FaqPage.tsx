import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faqData, generateFaqSchema } from '../content/faq-data';

export function FaqPage() {
  useEffect(() => {
    // Add JSON-LD schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(generateFaqSchema(faqData));
    document.head.appendChild(script);

    // Update meta tags
    document.title = 'Rent vs Buy FAQ | Common Questions Answered | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get answers to common rent vs buy questions. Learn about the 5% rule, mortgage tax benefits, PMI, breakeven timelines, and more.');
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-600 mb-8">
        Common questions about renting vs buying a home, answered with real math.
      </p>

      <div className="space-y-6">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-100 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {item.question}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">
          Ready to see your numbers?
        </h3>
        <p className="text-gray-600 mb-4">
          Get a personalized rent vs buy analysis based on your specific situation.
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
