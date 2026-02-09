# City Pages SEO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance city landing pages for SEO with calculator pre-loading, structured data, and expanded content.

**Architecture:** Modify useCalculator hook to accept initial city, create schema and content components, update CityPage to integrate all pieces.

**Tech Stack:** React, TypeScript, JSON-LD schemas

---

## Task 1: Update useCalculator Hook

**Files:**
- Modify: `frontend/src/hooks/useCalculator.ts`

**Step 1: Update function signature and initial state**

```typescript
import type { CityPreset } from '../data/cities';

export function useCalculator(initialCity?: CityPreset): UseCalculatorReturn {
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
    // City defaults override base defaults, URL params override city
    return { ...DEFAULT_INPUTS, ...cityDefaults, ...urlInputs };
  });

  // Also set selectedCity if initialCity provided
  const [selectedCity, setSelectedCity] = useState<string | null>(
    initialCity?.slug ?? null
  );
```

**Step 2: Verify existing functionality still works**

Run: `cd frontend && npm run build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Commit**

```bash
git add frontend/src/hooks/useCalculator.ts
git commit -m "feat: support initial city in useCalculator hook"
```

---

## Task 2: Update Calculator Component

**Files:**
- Modify: `frontend/src/components/Calculator.tsx`

**Step 1: Add initialCity prop**

```typescript
import type { CityData } from '../data/cities';

interface CalculatorProps {
  initialCity?: CityData;
}

export function Calculator({ initialCity }: CalculatorProps) {
  const { inputs, setInput, results, loading, error, copyUrl, handleCitySelect, selectedCity } = useCalculator(initialCity);
```

**Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/components/Calculator.tsx
git commit -m "feat: add initialCity prop to Calculator component"
```

---

## Task 3: Create CityPageSchema Component

**Files:**
- Create: `frontend/src/components/CityPageSchema.tsx`

**Step 1: Create the schema component**

```typescript
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
```

**Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/components/CityPageSchema.tsx
git commit -m "feat: add CityPageSchema component for JSON-LD"
```

---

## Task 4: Create CityContent Component

**Files:**
- Create: `frontend/src/components/CityContent.tsx`

**Step 1: Create content generation component**

```typescript
import type { CityData } from '../data/cities';

interface CityContentProps {
  city: CityData;
}

export function CityContent({ city }: CityContentProps) {
  const propertyTaxMonthly = Math.round((city.purchase_price * city.property_tax_rate) / 12);
  const insuranceMonthly = Math.round((city.purchase_price * city.home_insurance_rate) / 12);
  const priceToRent = Math.round(city.purchase_price / (city.monthly_rent * 12));

  const hasNoIncomeTax = city.state_tax_rate === 0;
  const hasHighPropertyTax = city.property_tax_rate >= 0.018;
  const hasHighInsurance = city.home_insurance_rate >= 0.008;
  const isExpensiveMarket = city.purchase_price >= 700000;

  return (
    <div className="space-y-8 mt-12">
      {/* Renting Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Renting in {city.name}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p>
            The median rent in {city.name} is <strong>${city.monthly_rent.toLocaleString()}/month</strong>.
            {hasNoIncomeTax
              ? ` With no state income tax in ${city.state}, renters who invest their savings see higher after-tax returns compared to high-tax states.`
              : ` ${city.state}'s ${(city.state_tax_rate * 100).toFixed(1)}% state income tax affects investment returns for renters, reducing the advantage of the "invest the difference" strategy.`
            }
          </p>
          <p>
            Renter's insurance in {city.name} typically costs $15-30/month, significantly less than homeowner's insurance at approximately ${insuranceMonthly.toLocaleString()}/month for a median-priced home.
          </p>
        </div>
      </section>

      {/* Buying Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Buying in {city.name}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p>
            The median home price in {city.name} is <strong>${city.purchase_price.toLocaleString()}</strong>.
            Property taxes average {(city.property_tax_rate * 100).toFixed(2)}%, adding approximately <strong>${propertyTaxMonthly.toLocaleString()}/month</strong> to ownership costs.
            {hasHighPropertyTax && " This is significantly above the national average of 1.1%."}
          </p>
          <p>
            Homeowner's insurance runs about ${insuranceMonthly.toLocaleString()}/month.
            {hasHighInsurance && ` ${city.state} has elevated insurance costs due to natural disaster risk factors.`}
            {city.hoa_monthly > 0 && ` Many properties also have HOA fees averaging $${city.hoa_monthly}/month.`}
          </p>
        </div>
      </section>

      {/* Key Factors Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Key Factors for {city.name}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p>
            The price-to-rent ratio in {city.name} is approximately <strong>{priceToRent}x</strong>.
            {priceToRent >= 20
              ? " Ratios above 20 generally favor renting, as the cost of ownership outpaces rental costs."
              : priceToRent >= 15
              ? " Ratios between 15-20 suggest the decision depends heavily on your specific situation and holding period."
              : " Ratios below 15 typically favor buying, as ownership costs are relatively low compared to renting."
            }
          </p>
          <p>
            {isExpensiveMarket
              ? `In high-cost markets like ${city.name}, the large down payment required represents significant opportunity cost. A 20% down payment of $${(city.purchase_price * 0.2).toLocaleString()} could generate substantial returns if invested instead.`
              : `${city.name}'s relatively affordable prices mean lower opportunity cost on the down payment, making the break-even timeline shorter.`
            }
          </p>
          {hasNoIncomeTax && (
            <p>
              {city.state}'s lack of state income tax benefits both renters and buyers, though the effect differs. Renters keep more of their investment gains, while buyers have more take-home pay for mortgage payments.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/components/CityContent.tsx
git commit -m "feat: add CityContent component for SEO content"
```

---

## Task 5: Update CityPage with All Enhancements

**Files:**
- Modify: `frontend/src/pages/CityPage.tsx`

**Step 1: Import new components and update meta tags**

Add imports:
```typescript
import { CityPageSchema } from '../components/CityPageSchema';
import { CityContent } from '../components/CityContent';
```

Update useEffect for comprehensive meta tags:
```typescript
useEffect(() => {
  if (city) {
    // Title with year
    document.title = `Rent vs Buy in ${city.name}, ${city.stateAbbr} (2026) | Own vs Rent`;

    // Meta description
    const desc = `Should you rent or buy in ${city.name}? Free calculator with local data. Median home: $${city.purchase_price.toLocaleString()}, rent: $${city.monthly_rent.toLocaleString()}/mo. Compare costs and find your break-even point.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);

    // Open Graph
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `Rent vs Buy Calculator: ${city.name}, ${city.stateAbbr}`);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://ownvsrent.io/cities/${city.slug}`);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://ownvsrent.io/cities/${city.slug}`);
  }

  return () => {
    // Cleanup: reset to defaults when leaving page
    document.title = 'Rent vs Buy Calculator 2026 | Should You Rent or Buy a Home?';
  };
}, [city]);
```

**Step 2: Add schema component and pass city to Calculator**

In the return statement, add:
```tsx
return (
  <>
    <CityPageSchema city={city} />
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* ... existing breadcrumb, header, stats ... */}

      {/* Calculator - now with city pre-loaded */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Run Your Numbers for {city.name}
        </h2>
        <p className="text-gray-600 mb-6">
          Calculator pre-loaded with {city.name} market averages. Adjust the values to match your situation.
        </p>
        <Calculator initialCity={city} />
      </div>

      {/* NEW: City Content */}
      <CityContent city={city} />

      {/* ... existing other cities, related content ... */}
    </div>
  </>
);
```

**Step 3: Verify build and test**

Run: `cd frontend && npm run build`
Expected: Build succeeds

Run: `cd frontend && npm run dev`
Test: Visit http://localhost:5173/cities/san-francisco
Expected: Calculator shows SF values ($1,100,000 price, $3,200 rent), content sections appear

**Step 4: Commit**

```bash
git add frontend/src/pages/CityPage.tsx
git commit -m "feat: enhance CityPage with schemas, content, and calculator pre-loading"
```

---

## Task 6: Final Testing and Deployment

**Step 1: Build and verify all pages**

Run: `cd frontend && npm run build`
Expected: Build succeeds with no errors

**Step 2: Test multiple city pages**

Verify these pages work:
- /cities/san-francisco (expensive, CA taxes)
- /cities/austin (no income tax, high property tax)
- /cities/miami (no income tax, high insurance)
- /cities/new-york (high taxes, high HOA)

**Step 3: Validate JSON-LD**

Copy schema from page source, validate at: https://validator.schema.org/

**Step 4: Deploy**

```bash
git push origin main
```

GitHub Actions will deploy automatically.

**Step 5: Verify production**

Visit: https://ownvsrent.io/cities/san-francisco
Confirm: Calculator pre-loads, content appears, schemas in source

---

## Summary

| Task | Files | Purpose |
|------|-------|---------|
| 1 | useCalculator.ts | Accept initial city parameter |
| 2 | Calculator.tsx | Add initialCity prop |
| 3 | CityPageSchema.tsx | JSON-LD structured data |
| 4 | CityContent.tsx | Auto-generated SEO content |
| 5 | CityPage.tsx | Integrate all enhancements |
| 6 | - | Testing and deployment |
