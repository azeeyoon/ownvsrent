import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Calculator' },
  { to: '/guide', label: 'Guide' },
  { to: '/methodology', label: 'How It Works' },
  { to: '/faq', label: 'FAQ' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-6">
      {navLinks.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`text-sm font-medium transition-colors ${
            location.pathname === to
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
