const mockRates = [
  { term: '30-year fixed', rate: 6.875, apr: 6.95 },
  { term: '15-year fixed', rate: 6.125, apr: 6.25 },
  { term: '5/1 ARM', rate: 6.25, apr: 7.15 },
];

interface MortgageRateWidgetProps {
  className?: string;
}

export function MortgageRateWidget({ className = '' }: MortgageRateWidgetProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm">Today's Mortgage Rates</h3>
        <p className="text-xs text-gray-500">National average rates</p>
      </div>

      <div className="divide-y divide-gray-100">
        {mockRates.map((rate) => (
          <div key={rate.term} className="px-4 py-3 flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-900 text-sm">{rate.term}</div>
              <div className="text-xs text-gray-500">APR: {rate.apr}%</div>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {rate.rate}%
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <a
          href="https://www.bankrate.com/mortgages/mortgage-rates/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Compare rates →
        </a>
        <p className="text-xs text-gray-400 mt-1">
          Rates as of {new Date().toLocaleDateString()}. Partner link.
        </p>
      </div>
    </div>
  );
}
