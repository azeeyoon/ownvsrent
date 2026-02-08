import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faqData, generateFaqSchema } from '../content/faq-data';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 text-lg">{question}</span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          isOpen ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-gray-100 text-gray-600'
        }`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {answer}
        </div>
      </div>
    </div>
  );
}

// Group FAQs by category
const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    description: 'Essential questions about the rent vs buy decision',
    questions: [0, 2, 3] // Is it better, 5% rule, down payment
  },
  {
    id: 'costs',
    title: 'Costs & Finances',
    icon: '💰',
    description: 'Understanding the true cost of owning vs renting',
    questions: [1, 6, 7, 8, 11] // How much to spend, true cost, taxes, PMI, opportunity cost
  },
  {
    id: 'decision',
    title: 'Making the Decision',
    icon: '🎯',
    description: 'Factors that influence which option is better for you',
    questions: [4, 5, 9, 10, 12, 13, 14] // throwing money away, how long to stay, appreciation, afford, rates, condo, equity vs stocks
  }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    // Add JSON-LD schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(generateFaqSchema(faqData));
    document.head.appendChild(script);

    // Update meta tags
    document.title = 'Rent vs Buy FAQ 2026 | Common Questions Answered | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get answers to common rent vs buy questions. Learn about the 5% rule, mortgage tax benefits, PMI, breakeven timelines, and more.');
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-sm text-purple-300 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-purple-200">FAQ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl">
            Get clear answers to the most common rent vs buy questions — backed by real math, not real estate sales pitches.
          </p>
          <div className="flex items-center gap-6 mt-8 text-sm text-purple-300">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {faqData.length} questions answered
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {faqCategories.length} categories
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Quick Jump */}
        <nav className="mb-12 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Jump to Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {faqCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-purple-600"
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.title}</span>
                <span className="text-xs text-gray-400">({category.questions.length})</span>
              </a>
            ))}
          </div>
        </nav>

        {/* FAQ Categories */}
        <div className="space-y-16">
          {faqCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                  {category.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {category.questions.map((questionIndex) => (
                  <FaqItem
                    key={questionIndex}
                    question={faqData[questionIndex].question}
                    answer={faqData[questionIndex].answer}
                    isOpen={openIndex === questionIndex}
                    onToggle={() => toggleQuestion(questionIndex)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-purple-200 mb-8 max-w-lg mx-auto">
              The best way to answer "should I rent or buy?" is to run your own numbers. Get a personalized analysis in seconds.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-semibold rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
            >
              Try the Calculator
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/guide"
            className="group p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📚</span>
              <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                Complete Rent vs Buy Guide
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              Dive deeper with our comprehensive guide covering all aspects of the rent vs buy decision.
            </p>
          </Link>
          <Link
            to="/methodology"
            className="group p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔬</span>
              <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                How the Calculator Works
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              Learn about our month-by-month simulation methodology and transparent calculations.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
