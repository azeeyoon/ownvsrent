import type { CityData } from '../data/cities';

interface CityPageSchemaProps {
  city: CityData;
}

export function CityPageSchema({ city }: CityPageSchemaProps) {
  const baseUrl = 'https://ownvsrent.io';

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Rent vs Buy Calculator: ${city.name}, ${city.stateAbbr}`,
    "description": `Should you rent or buy in ${city.name}? Free calculator with local market data. Median home price: $${city.purchase_price.toLocaleString()}, median rent: $${city.monthly_rent.toLocaleString()}/month.`,
    "url": `${baseUrl}/cities/${city.slug}`,
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": `${city.name} Rent vs Buy Calculator`,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    "about": {
      "@type": "Place",
      "name": city.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city.name,
        "addressRegion": city.stateAbbr,
        "addressCountry": "US"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Cities",
        "item": `${baseUrl}/cities`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${city.name}, ${city.stateAbbr}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
