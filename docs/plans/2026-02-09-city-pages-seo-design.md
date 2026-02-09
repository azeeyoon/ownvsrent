# City-Specific Landing Pages SEO Enhancement

## Overview

Enhance the existing city landing pages (`/cities/[slug]`) to improve SEO rankings for "rent vs buy [city]" keywords. The pages exist but need calculator pre-loading, structured data, and expanded content.

## Goals

1. Rank for "rent vs buy [city]" keywords for 26 major US metros
2. Provide unique, useful content per city (not thin/duplicate)
3. Proper structured data for search engines
4. Calculator auto-loads city defaults when visiting city pages

## Technical Design

### 1. Calculator Pre-loading

**Problem:** Calculator shows national defaults even on city pages.

**Solution:** Pass city data as prop to Calculator component.

```tsx
// CityPage.tsx
<Calculator initialCity={city} />

// useCalculator.ts - modify initial state
const [inputs, setInputs] = useState<CalculatorInputs>(() => {
  const urlInputs = parseUrlInputs();
  const cityDefaults = initialCity ? {
    monthly_rent: initialCity.monthly_rent,
    purchase_price: initialCity.purchase_price,
    property_tax_rate: initialCity.property_tax_rate,
    home_insurance_rate: initialCity.home_insurance_rate,
    hoa_monthly: initialCity.hoa_monthly,
    state_tax_rate: initialCity.state_tax_rate,
  } : {};
  return { ...DEFAULT_INPUTS, ...cityDefaults, ...urlInputs };
});
```

### 2. JSON-LD Structured Data

Two schemas per city page:

**WebPage + FinancialCalculator + Place:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Rent vs Buy Calculator: San Francisco, CA",
  "url": "https://ownvsrent.io/cities/san-francisco",
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "San Francisco Rent vs Buy Calculator",
    "applicationCategory": "FinanceApplication"
  },
  "about": {
    "@type": "Place",
    "name": "San Francisco",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  }
}
```

**BreadcrumbList:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ownvsrent.io" },
    { "@type": "ListItem", "position": 2, "name": "Cities", "item": "https://ownvsrent.io/cities" },
    { "@type": "ListItem", "position": 3, "name": "San Francisco, CA" }
  ]
}
```

### 3. Expanded City Content

Auto-generate content sections from existing city data:

**Section: "Renting in [City]"**
- Monthly rent context
- State tax impact on investment returns
- Renter insurance costs

**Section: "Buying in [City]"**
- Property tax context (high/low relative to national)
- Insurance considerations (FL hurricane, CA fire risk)
- HOA prevalence

**Section: "Key Factors for [City]"**
- State income tax situation
- Price-to-rent ratio interpretation
- Market-specific recommendation

Content is generated dynamically from data, ensuring uniqueness and accuracy.

### 4. Enhanced Meta Tags

```tsx
useEffect(() => {
  // Title with year for freshness
  document.title = `Rent vs Buy in ${city.name}, ${city.stateAbbr} (2026) | Own vs Rent`;

  // Description with numbers
  const desc = `Should you rent or buy in ${city.name}? Free calculator with local data. Median home: $${price}, rent: $${rent}/mo.`;

  // OG tags
  // Canonical URL
}, [city]);
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useCalculator.ts` | Accept optional `initialCity` parameter |
| `src/components/Calculator.tsx` | Accept and pass `initialCity` prop |
| `src/pages/CityPage.tsx` | Pass city to Calculator, add schemas, add content sections, enhance meta tags |

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/CityPageSchema.tsx` | JSON-LD structured data component |
| `src/components/CityContent.tsx` | Auto-generated content sections |

## Success Criteria

1. Calculator pre-loads city values on `/cities/[slug]` pages
2. JSON-LD schemas validate in Google's Rich Results Test
3. Each city page has 400+ words of unique, factual content
4. Meta tags include city name, year, and key numbers
5. All 26 city pages render correctly
