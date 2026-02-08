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
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-4">Wealth Over Time</h3>
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
                name === 'renter' ? 'Renter' : 'Buyer',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend
              iconType="line"
              formatter={(value) =>
                value === 'renter' ? 'Renter Wealth' : 'Buyer Wealth'
              }
              wrapperStyle={{ fontSize: 12 }}
            />
            {results.break_even_year && (
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
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Renter wealth = investment portfolio. Buyer wealth = home equity + portfolio − selling costs − taxes.
      </p>
    </div>
  );
}
