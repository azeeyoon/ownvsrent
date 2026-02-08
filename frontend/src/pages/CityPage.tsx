import { useParams } from 'react-router-dom';

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Rent vs Buy in {slug}
      </h1>
      <p className="text-gray-600">City page content coming soon...</p>
    </div>
  );
}
