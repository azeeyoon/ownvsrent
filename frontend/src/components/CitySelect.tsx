import { CITIES, type CityPreset } from '../data/cities';

interface CitySelectProps {
  onSelect: (city: CityPreset) => void;
  selectedSlug: string | null;
}

export function CitySelect({ onSelect, selectedSlug }: CitySelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <label className="text-sm text-gray-600">Start with city defaults</label>
        <div className="relative group">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="About city presets"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="font-medium text-gray-900 mb-1">City Presets</div>
            <p className="leading-relaxed">Pre-fills rent, home price, property tax, insurance, HOA, and state tax based on typical values for each city. You can still adjust any value after selecting.</p>
            <div className="absolute left-3 bottom-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
          </div>
        </div>
      </div>
      <select
        value={selectedSlug || 'national'}
        onChange={(e) => {
          const city = CITIES.find((c) => c.slug === e.target.value);
          if (city) onSelect(city);
        }}
        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
      >
        {CITIES.map((city) => (
          <option key={city.slug} value={city.slug}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}
