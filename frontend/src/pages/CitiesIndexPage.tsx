import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CITIES } from '../data/cities';

export function CitiesIndexPage() {
  useEffect(() => {
    document.title = 'Rent vs Buy by City | Compare 25 Major US Metros | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explore rent vs buy calculators for 25 major US cities. Pre-loaded with local market data for San Francisco, NYC, LA, Seattle, Austin, and more.');
    }
  }, []);

  const cities = CITIES.filter(c => c.slug !== 'national');

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Rent vs Buy by City
      </h1>
      <p className="text-gray-600 mb-8">
        Explore rent vs buy calculators pre-loaded with market data for 25 major US metros.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map(city => (
          <Link
            key={city.slug}
            to={`/cities/${city.slug}`}
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="font-medium text-gray-900">{city.name}, {city.stateAbbr}</div>
            <div className="text-sm text-gray-500 mt-1">
              ${city.purchase_price.toLocaleString()} median home
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
