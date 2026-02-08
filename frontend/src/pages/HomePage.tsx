import { Calculator } from '../components/Calculator';

export function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Should You Rent or Buy a Home in 2026?
        </h1>
        <p className="text-gray-600 mt-2 text-base max-w-2xl">
          Free rent vs buy calculator with real math — taxes, appreciation, opportunity cost, and the numbers most calculators hide.
        </p>
      </div>
      <Calculator />
    </div>
  );
}
