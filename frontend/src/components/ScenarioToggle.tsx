interface ScenarioToggleProps {
  enabled: boolean;
  onToggle: () => void;
  activeTab: 'a' | 'b';
  onTabChange: (tab: 'a' | 'b') => void;
}

export function ScenarioToggle({
  enabled,
  onToggle,
  activeTab,
  onTabChange,
}: ScenarioToggleProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onToggle}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          enabled
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        {enabled ? 'Exit Comparison' : 'Compare Scenarios'}
      </button>

      {enabled && (
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => onTabChange('a')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'a'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Scenario A
          </button>
          <button
            onClick={() => onTabChange('b')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'b'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Scenario B
          </button>
        </div>
      )}
    </div>
  );
}
