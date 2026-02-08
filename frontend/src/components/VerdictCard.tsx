import type { CalculatorResults } from '../lib/api';
import { formatCurrency } from '../lib/formatters';

interface VerdictCardProps {
  results: CalculatorResults;
  holdingPeriod: number;
}

export function VerdictCard({ results, holdingPeriod }: VerdictCardProps) {
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

      {/* Break-even */}
      <div className="text-sm pt-4 border-t border-gray-200">
        <span className="text-gray-500">Break-even:</span>{' '}
        <span className="text-gray-900 font-medium">
          {results.break_even_year
            ? `Year ${results.break_even_year}`
            : 'Never (within 30 years)'}
        </span>
      </div>
    </div>
  );
}
