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
}

export function WealthChart({ results }: WealthChartProps) {
  const data = results.yearly_snapshots.map((snapshot) => ({
    year: snapshot.year,
    renter: snapshot.renter_wealth,
    buyer: snapshot.buyer_wealth,
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Wealth Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="year"
              stroke="#9CA3AF"
              tickFormatter={(v) => `Yr ${v}`}
            />
            <YAxis
              stroke="#9CA3AF"
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F3F4F6' }}
              formatter={(value, name) => [
                formatCompactCurrency(value as number),
                name === 'renter' ? 'Renter Wealth' : 'Buyer Wealth',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend
              formatter={(value) =>
                value === 'renter' ? 'Renter Wealth' : 'Buyer Wealth'
              }
            />
            {results.break_even_year && (
              <ReferenceLine
                x={results.break_even_year}
                stroke="#9CA3AF"
                strokeDasharray="5 5"
                label={{
                  value: 'Break-even',
                  fill: '#9CA3AF',
                  fontSize: 12,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="renter"
              stroke="#2da88e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="buyer"
              stroke="#d4a843"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Renter wealth = investment portfolio. Buyer wealth = home equity + portfolio - selling costs - taxes.
      </p>
    </div>
  );
}
