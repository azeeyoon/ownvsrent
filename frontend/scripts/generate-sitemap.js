import { writeFileSync } from 'fs';

const BASE_URL = 'https://ownvsrent.io';

const cities = [
  'san-francisco', 'new-york', 'los-angeles', 'seattle', 'boston',
  'austin', 'denver', 'miami', 'chicago', 'washington-dc',
  'san-diego', 'portland', 'phoenix', 'dallas', 'atlanta',
  'houston', 'philadelphia', 'minneapolis', 'nashville', 'raleigh',
  'salt-lake-city', 'charlotte', 'tampa', 'san-jose', 'las-vegas'
];

const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/guide', priority: 0.9, changefreq: 'monthly' },
  { path: '/methodology', priority: 0.7, changefreq: 'monthly' },
  { path: '/faq', priority: 0.8, changefreq: 'monthly' },
  { path: '/cities', priority: 0.8, changefreq: 'weekly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
];

const cityPages = cities.map(slug => ({
  path: `/cities/${slug}`,
  priority: 0.7,
  changefreq: 'weekly',
}));

const allPages = [...staticPages, ...cityPages];

const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated: public/sitemap.xml');
