import { useState } from 'react';

interface LeadCaptureFormProps {
  className?: string;
}

export function LeadCaptureForm({ className = '' }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // In production, this would submit to a backend
    console.log('Lead captured:', { email, zipCode });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-6 text-center ${className}`}>
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-green-900 mb-1">You're on the list!</h3>
        <p className="text-sm text-green-700">
          We'll send you personalized rent vs buy insights.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-xl p-6 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-1">
        Get Personalized Insights
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Receive a detailed analysis and market updates for your area.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="sr-only">Zip Code (optional)</label>
          <input
            type="text"
            id="zipCode"
            placeholder="Zip code (optional)"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            maxLength={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Get Insights
        </button>

        <p className="text-xs text-gray-400 text-center">
          No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
