import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CITIES, type CityData } from '../data/cities';
import { Calculator } from '../components/Calculator';

function findCity(slug: string): CityData | undefined {
  return CITIES.find(city => city.slug === slug);
}

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? findCity(slug) : undefined;

  useEffect(() => {
    if (city) {
      document.title = `Rent vs Buy Calculator: ${city.name}, ${city.stateAbbr} | ownvsrent.io`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `Should you rent or buy in ${city.name}? Use our free calculator with ${city.name} market data. Median home price: $${city.purchase_price.toLocaleString()}, median rent: $${city.monthly_rent.toLocaleString()}/month.`);
      }
    }
  }, [city]);

  if (!city) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/cities" className="hover:text-gray-700">Cities</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{city.name}, {city.stateAbbr}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rent vs Buy Calculator: {city.name}, {city.stateAbbr}
        </h1>
        <p className="text-gray-600 max-w-2xl">
          {city.description}
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Median Home Price</div>
          <div className="text-xl font-semibold text-gray-900">
            ${city.purchase_price.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Median Rent</div>
          <div className="text-xl font-semibold text-gray-900">
            ${city.monthly_rent.toLocaleString()}/mo
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Property Tax Rate</div>
          <div className="text-xl font-semibold text-gray-900">
            {(city.property_tax_rate * 100).toFixed(2)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">State Income Tax</div>
          <div className="text-xl font-semibold text-gray-900">
            {city.state_tax_rate === 0 ? 'None' : `${(city.state_tax_rate * 100).toFixed(2)}%`}
          </div>
        </div>
      </div>

      {/* Market Insight */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-blue-900 mb-1">{city.name} Market Insight</div>
            <p className="text-sm text-blue-800">{city.marketInsight}</p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Run Your Numbers for {city.name}
        </h2>
        <p className="text-gray-600 mb-6">
          Calculator pre-loaded with {city.name} market averages. Adjust the values to match your situation.
        </p>
        <Calculator />
      </div>

      {/* Other Cities */}
      <div className="border-t border-gray-100 pt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Compare Other Cities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {CITIES.filter(c => c.slug !== 'national' && c.slug !== city.slug)
            .slice(0, 10)
            .map(c => (
              <Link
                key={c.slug}
                to={`/cities/${c.slug}`}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {c.name}, {c.stateAbbr}
              </Link>
            ))}
        </div>
      </div>

      {/* Related Content */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/guide"
          className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1">Complete Rent vs Buy Guide</h4>
          <p className="text-sm text-gray-600">Learn everything about making the rent vs buy decision.</p>
        </Link>
        <Link
          to="/faq"
          className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1">Frequently Asked Questions</h4>
          <p className="text-sm text-gray-600">Get answers to common rent vs buy questions.</p>
        </Link>
      </div>
    </div>
  );
}
