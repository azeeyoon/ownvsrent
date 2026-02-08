import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { GuidePage } from './pages/GuidePage';
import { MethodologyPage } from './pages/MethodologyPage';
import { FaqPage } from './pages/FaqPage';
import { CityPage } from './pages/CityPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'guide', element: <GuidePage /> },
      { path: 'methodology', element: <MethodologyPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'cities/:slug', element: <CityPage /> },
    ],
  },
]);
