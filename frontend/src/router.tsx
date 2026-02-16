import { lazy, Suspense, Component, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';

// Eager load critical pages
import { HomePage } from './pages/HomePage';

// Helper to retry failed chunk loads by refreshing the page
function lazyWithRetry<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T } | { [key: string]: T }>,
  namedExport?: string
) {
  return lazy(() =>
    importFn()
      .then((module) => {
        if (namedExport) {
          return { default: (module as Record<string, T>)[namedExport] };
        }
        return module as { default: T };
      })
      .catch((error) => {
        // If chunk load fails (stale cache), reload the page once
        const hasRefreshed = sessionStorage.getItem('chunk-retry');
        if (!hasRefreshed) {
          sessionStorage.setItem('chunk-retry', 'true');
          window.location.reload();
        }
        throw error;
      })
  );
}

// Clear retry flag on successful page load
if (typeof window !== 'undefined') {
  sessionStorage.removeItem('chunk-retry');
}

// Lazy load non-critical pages with retry logic
const GuidePage = lazyWithRetry(() => import('./pages/GuidePage'), 'GuidePage');
const MethodologyPage = lazyWithRetry(() => import('./pages/MethodologyPage'), 'MethodologyPage');
const FaqPage = lazyWithRetry(() => import('./pages/FaqPage'), 'FaqPage');
const CityPage = lazyWithRetry(() => import('./pages/CityPage'), 'CityPage');
const CitiesIndexPage = lazyWithRetry(() => import('./pages/CitiesIndexPage'), 'CitiesIndexPage');
const BlogIndexPage = lazyWithRetry(() => import('./pages/BlogIndexPage'), 'BlogIndexPage');
const BlogPostPage = lazyWithRetry(() => import('./pages/BlogPostPage'), 'BlogPostPage');
const PrivacyPage = lazyWithRetry(() => import('./pages/PrivacyPage'), 'PrivacyPage');
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'), 'AboutPage');
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'), 'ContactPage');

// Error boundary for chunk load failures
interface ErrorBoundaryState {
  hasError: boolean;
}

class ChunkErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // If it's a chunk load error, reload the page
    if (error.message.includes('dynamically imported module') ||
        error.message.includes('Loading chunk')) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Loading latest version...</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Wrap lazy components with Suspense and error boundary
const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<unknown>>
) => (
  <ChunkErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </ChunkErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'guide', element: withSuspense(GuidePage) },
      { path: 'methodology', element: withSuspense(MethodologyPage) },
      { path: 'faq', element: withSuspense(FaqPage) },
      { path: 'cities', element: withSuspense(CitiesIndexPage) },
      { path: 'cities/:slug', element: withSuspense(CityPage) },
      { path: 'blog', element: withSuspense(BlogIndexPage) },
      { path: 'blog/:slug', element: withSuspense(BlogPostPage) },
      { path: 'privacy', element: withSuspense(PrivacyPage) },
      { path: 'about', element: withSuspense(AboutPage) },
      { path: 'contact', element: withSuspense(ContactPage) },
    ],
  },
]);
