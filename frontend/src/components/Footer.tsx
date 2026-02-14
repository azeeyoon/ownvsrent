import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="text-xl">🏠</span>
              <span>Own <span className="text-gray-400 font-normal">vs</span> Rent</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Free rent vs buy calculator with real math — no sales pitches.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  Rent vs Buy Calculator
                </Link>
              </li>
              <li>
                <Link to="/cities" className="text-gray-500 hover:text-gray-700">
                  City Comparisons
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/guide" className="text-gray-500 hover:text-gray-700">
                  Complete Guide
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-500 hover:text-gray-700">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="text-gray-500 hover:text-gray-700">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-500 hover:text-gray-700">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-gray-700">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-gray-700">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Own vs Rent. All calculations run locally in your browser.
          </p>
          <p className="text-gray-400 text-xs">
            Not financial advice. Consult a professional for your specific situation.
          </p>
        </div>
      </div>
    </footer>
  );
}
