import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/guide" className="hover:text-gray-700">Guide</Link>
            <Link to="/methodology" className="hover:text-gray-700">Methodology</Link>
            <Link to="/faq" className="hover:text-gray-700">FAQ</Link>
          </div>
          <p className="text-gray-400 text-sm">
            All calculations run locally. No data is stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
