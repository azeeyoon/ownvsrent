interface AffiliateLink {
  name: string;
  description: string;
  url: string;
  logo?: string;
  cta: string;
}

// Update these URLs with your actual affiliate links
const mortgageAffiliates: AffiliateLink[] = [
  {
    name: 'LendingTree',
    description: 'Compare rates from multiple lenders',
    url: 'https://www.lendingtree.com/?esession=YOUR_AFFILIATE_ID', // Replace with your affiliate link
    cta: 'Compare Rates',
  },
  {
    name: 'Bankrate',
    description: 'See today\'s best mortgage rates',
    url: 'https://www.bankrate.com/mortgages/?pid=YOUR_AFFILIATE_ID', // Replace with your affiliate link
    cta: 'View Rates',
  },
  {
    name: 'NerdWallet',
    description: 'Get personalized rate quotes',
    url: 'https://www.nerdwallet.com/mortgages?trk=YOUR_AFFILIATE_ID', // Replace with your affiliate link
    cta: 'Get Quotes',
  },
];

const insuranceAffiliates: AffiliateLink[] = [
  {
    name: 'Policygenius',
    description: 'Compare home insurance quotes',
    url: 'https://www.policygenius.com/homeowners-insurance/?affiliate=YOUR_ID', // Replace with your affiliate link
    cta: 'Compare Quotes',
  },
];

interface MortgageRateWidgetProps {
  variant?: 'full' | 'compact' | 'inline';
  className?: string;
}

export function MortgageRateWidget({ variant = 'full', className = '' }: MortgageRateWidgetProps) {
  if (variant === 'inline') {
    return (
      <a
        href={mortgageAffiliates[0].url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium ${className}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Compare Mortgage Rates
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">Ready to get a mortgage?</p>
            <p className="text-sm text-gray-600">Compare rates from top lenders</p>
          </div>
          <a
            href={mortgageAffiliates[0].url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-shrink-0 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold"
          >
            Compare Rates →
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <span className="italic">Sponsored</span> — We may earn a commission if you get a quote
        </p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Compare Mortgage Rates</h3>
            <p className="text-emerald-100 text-sm">Get personalized quotes from top lenders</p>
          </div>
        </div>
      </div>

      {/* Affiliate Links */}
      <div className="p-4 space-y-3">
        {mortgageAffiliates.map((affiliate) => (
          <a
            key={affiliate.name}
            href={affiliate.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-700">
                {affiliate.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {affiliate.name}
                </p>
                <p className="text-sm text-gray-600">{affiliate.description}</p>
              </div>
            </div>
            <span className="flex-shrink-0 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold group-hover:bg-emerald-700 transition-colors">
              {affiliate.cta}
            </span>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Advertiser Disclosure:</span> We may receive compensation when you click on links to our partners. This does not influence our ratings or recommendations.
        </p>
      </div>
    </div>
  );
}

interface InsuranceWidgetProps {
  className?: string;
}

export function InsuranceWidget({ className = '' }: InsuranceWidgetProps) {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">Don't Forget Home Insurance</h4>
          <p className="text-sm text-gray-600 mb-3">
            Required for most mortgages. Compare quotes to save up to $500/year.
          </p>
          <a
            href={insuranceAffiliates[0].url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Compare Insurance Quotes
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3 italic">
        Sponsored — We may earn a commission if you get a quote
      </p>
    </div>
  );
}

// Combined widget for after calculator results
interface CalculatorAffiliateWidgetProps {
  verdict: 'buy' | 'rent' | 'toss-up';
  className?: string;
}

export function CalculatorAffiliateWidget({ verdict, className = '' }: CalculatorAffiliateWidgetProps) {
  // Only show mortgage widget if buying is favorable or toss-up
  if (verdict === 'rent') {
    return null; // Don't show mortgage ads when renting is clearly better
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <MortgageRateWidget variant="full" />
      <InsuranceWidget />
    </div>
  );
}
