// frontend/src/components/Calculator.tsx
import { useCalculator } from '../hooks/useCalculator';
import { InputPanel } from './InputPanel';
import { VerdictCard } from './VerdictCard';
import { WealthChart } from './WealthChart';

export function Calculator() {
  const { inputs, setInput, results, loading, error } = useCalculator();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Inputs */}
      <div>
        <InputPanel inputs={inputs} setInput={setInput} />
      </div>

      {/* Right: Results */}
      <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {loading && !results && (
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-700 rounded-lg h-48"></div>
            <div className="bg-gray-700 rounded-lg h-64"></div>
          </div>
        )}

        {results && (
          <>
            <div className={loading ? 'opacity-60' : ''}>
              <VerdictCard
                results={results}
                holdingPeriod={inputs.holding_period_years}
              />
            </div>
            <div className={loading ? 'opacity-60' : ''}>
              <WealthChart results={results} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
