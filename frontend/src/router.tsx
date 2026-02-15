import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';

// Eager load critical pages
import { HomePage } from './pages/HomePage';

// Lazy load non-critical pages
const GuidePage = lazy(() =>
  import('./pages/GuidePage').then((m) => ({ default: m.GuidePage }))
);
const MethodologyPage = lazy(() =>
  import('./pages/MethodologyPage').then((m) => ({ default: m.MethodologyPage }))
);
const FaqPage = lazy(() =>
  import('./pages/FaqPage').then((m) => ({ default: m.FaqPage }))
);
const CityPage = lazy(() =>
  import('./pages/CityPage').then((m) => ({ default: m.CityPage }))
);
const CitiesIndexPage = lazy(() =>
  import('./pages/CitiesIndexPage').then((m) => ({ default: m.CitiesIndexPage }))
);
const BlogIndexPage = lazy(() =>
  import('./pages/BlogIndexPage').then((m) => ({ default: m.BlogIndexPage }))
);
const BlogPostPage = lazy(() =>
  import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Wrap lazy components with Suspense
const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<unknown>>
) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
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
