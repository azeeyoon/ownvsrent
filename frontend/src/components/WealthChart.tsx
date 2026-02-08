import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import type { CalculatorResults } from '../lib/api';
import { formatCompactCurrency } from '../lib/formatters';

interface WealthChartProps {
  results: CalculatorResults;
  resultsB?: CalculatorResults | null;
}

export function WealthChart({ results, resultsB }: WealthChartProps) {
  const isComparing = !!resultsB;

  // For comparison mode, merge both scenarios' data
  const data = results.yearly_snapshots.map((snapshot, i) => {
    const base: Record<string, number> = {
      year: snapshot.year,
      renter: snapshot.renter_wealth,
      buyer: snapshot.buyer_wealth,
    };

    if (resultsB?.yearly_snapshots[i]) {
      base.renterB = resultsB.yearly_snapshots[i].renter_wealth;
      base.buyerB = resultsB.yearly_snapshots[i].buyer_wealth;
    }

    return base;
  });

  const formatLegend = (value: string) => {
    if (isComparing) {
      switch (value) {
        case 'renter':
          return 'A: Renter';
        case 'buyer':
          return 'A: Buyer';
        case 'renterB':
          return 'B: Renter';
        case 'buyerB':
          return 'B: Buyer';
        default:
          return value;
      }
    }
    return value === 'renter' ? 'Renter Wealth' : 'Buyer Wealth';
  };

  const formatTooltipName = (name: string) => {
    if (isComparing) {
      switch (name) {
        case 'renter':
          return 'A: Renter';
        case 'buyer':
          return 'A: Buyer';
        case 'renterB':
          return 'B: Renter';
        case 'buyerB':
          return 'B: Buyer';
        default:
          return name;
      }
    }
    return name === 'renter' ? 'Renter' : 'Buyer';
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-4">
        {isComparing ? 'Wealth Comparison' : 'Wealth Over Time'}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactCurrency(v)}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: '#374151', fontWeight: 500 }}
              formatter={(value, name) => [
                formatCompactCurrency(value as number),
                formatTooltipName(name as string),
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend
              iconType="line"
              formatter={formatLegend}
              wrapperStyle={{ fontSize: 12 }}
            />
            {!isComparing && results.break_even_year && (
              <ReferenceLine
                x={results.break_even_year}
                stroke="#9CA3AF"
                strokeDasharray="4 4"
                label={{
                  value: 'Break-even',
                  fill: '#9CA3AF',
                  fontSize: 11,
                  position: 'top',
                }}
              />
            )}
            {/* Scenario A lines */}
            <Line
              type="monotone"
              dataKey="renter"
              stroke="#0284c7"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="buyer"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
            />
            {/* Scenario B lines (dashed) */}
            {isComparing && (
              <>
                <Line
                  type="monotone"
                  dataKey="renterB"
                  stroke="#0284c7"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="buyerB"
                  stroke="#059669"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        {isComparing
          ? 'Solid lines = Scenario A. Dashed lines = Scenario B.'
          : 'Renter wealth = investment portfolio. Buyer wealth = home equity + portfolio − selling costs − taxes.'}
      </p>
    </div>
  );
}
