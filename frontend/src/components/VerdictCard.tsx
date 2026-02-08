import type { CalculatorResults } from '../lib/api';
import { formatCurrency } from '../lib/formatters';

interface VerdictCardProps {
  results: CalculatorResults;
  holdingPeriod: number;
  filingStatus: 'single' | 'married';
}

export function VerdictCard({ results, holdingPeriod, filingStatus }: VerdictCardProps) {
  const isRentWins = results.verdict === 'rent';
  const isTossUp = results.verdict === 'toss-up';
  const benefit = Math.abs(results.net_benefit_at_horizon);

  const accentColor = isTossUp
    ? 'text-gray-600'
    : isRentWins
    ? 'text-accent-rent'
    : 'text-accent-buy';

  return (
    <div className="bg-gray-50 rounded-xl p-8">
      {/* Verdict Badge */}
      <div className="mb-2">
        <span className={`text-xs font-medium uppercase tracking-wider ${accentColor}`}>
          {isTossUp ? 'Too Close to Call' : isRentWins ? 'Rent Wins' : 'Buy Wins'}
        </span>
      </div>

      {/* Main Headline */}
      <h2 className="text-3xl font-semibold text-gray-900 mb-1">
        {isTossUp ? (
          'The difference is minimal'
        ) : (
          <>
            {isRentWins ? 'Renting' : 'Buying'} saves you{' '}
            <span className={accentColor}>{formatCurrency(benefit)}</span>
          </>
        )}
      </h2>
      <p className="text-gray-500 mb-6">
        over {holdingPeriod} {holdingPeriod === 1 ? 'year' : 'years'}
      </p>

      {/* Monthly Comparison */}
      <div className="flex gap-8 text-sm mb-4">
        <div>
          <span className="text-gray-500">Monthly Rent</span>
          <p className="text-gray-900 font-medium text-lg">
            {formatCurrency(results.monthly_rent)}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Monthly Ownership</span>
          <p className="text-gray-900 font-medium text-lg">
            {formatCurrency(results.monthly_ownership_cost)}
          </p>
        </div>
      </div>

      {/* Break-even & Rent Equivalent */}
      <div className="flex gap-8 text-sm pt-4 border-t border-gray-200">
        <div>
          <span className="text-gray-500">Break-even:</span>{' '}
          <span className="text-gray-900 font-medium">
            {results.break_even_year
              ? `Year ${results.break_even_year}`
              : 'Never (within 30 years)'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Rent Equivalent:</span>{' '}
          <span className="text-gray-900 font-medium">
            {formatCurrency(results.rent_equivalent)}/mo
          </span>
          <div className="relative group">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              aria-label="What is rent equivalent?"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <p>Your true monthly cost of ownership, accounting for all costs minus equity built. Compare this directly to rent.</p>
              <div className="absolute left-3 bottom-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemization Warning */}
      {!results.itemization_beneficial && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-900 font-medium">Standard deduction is better for you</p>
                <p className="text-sm text-blue-700 mt-1">
                  With your inputs, the standard deduction ({filingStatus === 'married' ? '$31,500' : '$15,750'}) exceeds your itemized deductions. You won't get additional tax savings from mortgage interest.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
