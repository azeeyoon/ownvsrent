import { Link } from 'react-router-dom';

export function AuthorBio() {
  return (
    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 my-10">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
        OvR
      </div>
      <div>
        <div className="font-semibold text-gray-900">Own vs Rent Team</div>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          We're software engineers and personal finance enthusiasts who built this calculator
          because we were frustrated with biased tools online. Our mission: help you make
          smarter housing decisions with transparent math, not sales pitches.
        </p>
        <Link to="/about" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
          Learn more about us →
        </Link>
      </div>
    </div>
  );
}
