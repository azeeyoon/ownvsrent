import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { methodologySections } from '../content/methodology-content';

export function MethodologyPage() {
  useEffect(() => {
    document.title = 'How Our Rent vs Buy Calculator Works | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn exactly how our rent vs buy calculator works. Month-by-month simulation, accurate tax calculations, and transparent methodology.');
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        How Our Rent vs Buy Calculator Works
      </h1>
      <p className="text-gray-600 mb-8">
        A detailed look at the math behind our calculations.
      </p>

      {/* Table of Contents */}
      <nav className="mb-10 p-4 bg-gray-50 rounded-xl">
        <h2 className="font-semibold text-gray-900 mb-3">Contents</h2>
        <ul className="space-y-1">
          {methodologySections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-gray-600 hover:text-gray-900"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content Sections */}
      <div className="space-y-12">
        {methodologySections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="prose prose-gray max-w-none">
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">
          See it in action
        </h3>
        <p className="text-gray-600 mb-4">
          Run your own numbers through our calculator.
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
