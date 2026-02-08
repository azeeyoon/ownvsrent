// frontend/src/components/Calculator.tsx
import { useState } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { useScenarioCompare } from '../hooks/useScenarioCompare';
import { InputPanel } from './InputPanel';
import { VerdictCard } from './VerdictCard';
import { WealthChart } from './WealthChart';
import { ScenarioToggle } from './ScenarioToggle';
import { formatCurrency } from '../lib/formatters';

export function Calculator() {
  const { inputs, setInput, results, loading, error, copyUrl, handleCitySelect, selectedCity } = useCalculator();
  const [showToast, setShowToast] = useState(false);

  // Scenario comparison
  const scenario = useScenarioCompare(inputs);

  const handleShare = async () => {
    const success = await copyUrl();
    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // When in comparison mode, use scenario inputs/results
  const activeInputs = scenario.enabled
    ? scenario.inputs[scenario.activeTab]
    : inputs;
  const activeSetInput = scenario.enabled
    ? <K extends keyof typeof inputs>(key: K, value: (typeof inputs)[K]) =>
        scenario.setScenarioInput(scenario.activeTab, key, value)
    : setInput;
  const activeResults = scenario.enabled
    ? scenario.results[scenario.activeTab]
    : results;
  const activeLoading = scenario.enabled
    ? scenario.loading[scenario.activeTab]
    : loading;

  return (
    <div className="space-y-6">
      {/* Scenario Toggle */}
      <ScenarioToggle
        enabled={scenario.enabled}
        onToggle={scenario.toggle}
        activeTab={scenario.activeTab}
        onTabChange={scenario.setActiveTab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Inputs */}
        <div>
          {scenario.enabled && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
              Editing <span className="font-medium text-gray-900">Scenario {scenario.activeTab.toUpperCase()}</span>.
              Switch tabs above to edit the other scenario.
            </div>
          )}
          <InputPanel
            inputs={activeInputs}
            setInput={activeSetInput}
            onCitySelect={handleCitySelect}
            selectedCity={selectedCity}
          />
        </div>

        {/* Right: Results */}
        <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
          {error && !scenario.enabled && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {activeLoading && !activeResults && (
            <div className="animate-pulse space-y-6">
              <div className="bg-gray-100 rounded-xl h-52"></div>
              <div className="bg-gray-100 rounded-xl h-72"></div>
            </div>
          )}

          {/* Comparison Mode Results */}
          {scenario.enabled && scenario.results.a && scenario.results.b && (
            <>
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>

              {/* Side-by-side comparison cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`bg-gray-50 rounded-xl p-4 ${scenario.activeTab === 'a' ? 'ring-2 ring-gray-900' : ''}`}>
                  <div className="text-xs font-medium text-gray-500 mb-2">Scenario A</div>
                  <div className={`text-sm font-medium uppercase tracking-wide ${
                    scenario.results.a.verdict === 'rent' ? 'text-accent-rent' :
                    scenario.results.a.verdict === 'buy' ? 'text-accent-buy' : 'text-gray-500'
                  }`}>
                    {scenario.results.a.verdict === 'toss-up' ? 'Too Close' :
                     scenario.results.a.verdict === 'rent' ? 'Rent Wins' : 'Buy Wins'}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {formatCurrency(Math.abs(scenario.results.a.net_benefit_at_horizon))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Rent: {formatCurrency(scenario.results.a.monthly_rent)}/mo<br />
                    Own: {formatCurrency(scenario.results.a.monthly_ownership_cost)}/mo
                  </div>
                </div>

                <div className={`bg-gray-50 rounded-xl p-4 ${scenario.activeTab === 'b' ? 'ring-2 ring-gray-900' : ''}`}>
                  <div className="text-xs font-medium text-gray-500 mb-2">Scenario B</div>
                  <div className={`text-sm font-medium uppercase tracking-wide ${
                    scenario.results.b.verdict === 'rent' ? 'text-accent-rent' :
                    scenario.results.b.verdict === 'buy' ? 'text-accent-buy' : 'text-gray-500'
                  }`}>
                    {scenario.results.b.verdict === 'toss-up' ? 'Too Close' :
                     scenario.results.b.verdict === 'rent' ? 'Rent Wins' : 'Buy Wins'}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {formatCurrency(Math.abs(scenario.results.b.net_benefit_at_horizon))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Rent: {formatCurrency(scenario.results.b.monthly_rent)}/mo<br />
                    Own: {formatCurrency(scenario.results.b.monthly_ownership_cost)}/mo
                  </div>
                </div>
              </div>

              {/* Comparison chart */}
              <WealthChart results={scenario.results.a} resultsB={scenario.results.b} />
            </>
          )}

          {/* Normal Mode Results */}
          {!scenario.enabled && results && (
            <>
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
              <div className={loading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
                <VerdictCard
                  results={results}
                  holdingPeriod={inputs.holding_period_years}
                  filingStatus={inputs.filing_status}
                />
              </div>
              <div className={loading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
                <WealthChart results={results} />
              </div>
            </>
          )}

          {showToast && (
            <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
              Link copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
