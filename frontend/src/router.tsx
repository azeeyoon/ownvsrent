import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { GuidePage } from './pages/GuidePage';
import { MethodologyPage } from './pages/MethodologyPage';
import { FaqPage } from './pages/FaqPage';
import { CityPage } from './pages/CityPage';
import { CitiesIndexPage } from './pages/CitiesIndexPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'guide', element: <GuidePage /> },
      { path: 'methodology', element: <MethodologyPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'cities', element: <CitiesIndexPage /> },
      { path: 'cities/:slug', element: <CityPage /> },
      { path: 'blog', element: <BlogIndexPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
]);
