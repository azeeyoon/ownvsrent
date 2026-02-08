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

  const bgColor = isTossUp
    ? 'bg-gray-700'
    : isRentWins
    ? 'bg-accent-rent/20 border-accent-rent'
    : 'bg-accent-buy/20 border-accent-buy';

  const textColor = isTossUp
    ? 'text-gray-300'
    : isRentWins
    ? 'text-accent-rent'
    : 'text-accent-buy';

  return (
    <div className={`rounded-lg border-2 p-6 ${bgColor}`}>
      {/* Verdict Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-sm font-bold uppercase tracking-wide ${textColor}`}>
          {isTossUp ? 'Too Close to Call' : isRentWins ? 'Rent Wins' : 'Buy Wins'}
        </span>
      </div>

      {/* Main Headline */}
      <h2 className="text-2xl font-bold text-white mb-2">
        {isTossUp ? (
          'The difference is minimal'
        ) : (
          <>
            {isRentWins ? 'Renting' : 'Buying'} saves you{' '}
            <span className={textColor}>{formatCurrency(benefit)}</span>
          </>
        )}
      </h2>
      <p className="text-gray-400 mb-4">
        over {holdingPeriod} {holdingPeriod === 1 ? 'year' : 'years'}
      </p>

      {/* Monthly Comparison */}
      <div className="flex gap-6 text-sm mb-4">
        <div>
          <span className="text-gray-400">Monthly Rent:</span>{' '}
          <span className="text-white font-medium">
            {formatCurrency(results.monthly_rent)}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Monthly Ownership:</span>{' '}
          <span className="text-white font-medium">
            {formatCurrency(results.monthly_ownership_cost)}
          </span>
        </div>
      </div>

      {/* Break-even */}
      <div className="text-sm">
        <span className="text-gray-400">Break-even:</span>{' '}
        <span className="text-white font-medium">
          {results.break_even_year
            ? `Year ${results.break_even_year}`
            : 'Never (within 30 years)'}
        </span>
      </div>
    </div>
  );
}
