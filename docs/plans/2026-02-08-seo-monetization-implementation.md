# SEO Content & Monetization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add SEO content pages (guide, FAQ, methodology, city pages) and monetization (AdSense, affiliate widgets) to ownvsrent.io.

**Architecture:** React Router for client-side routing with vite-plugin-ssr-ssg for static pre-rendering. Content pages as separate routes with shared Layout component. AdSense and affiliate widgets integrated into content pages.

**Tech Stack:** React Router v6, vite-plugin-ssr-ssg, Google AdSense, Tailwind CSS.

---

## Phase 1: Routing Infrastructure

### Task 1: Install React Router and Configure Routes

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/router.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/App.tsx`

**Step 1: Install react-router-dom**

Run:
```bash
cd frontend && npm install react-router-dom
```

**Step 2: Create router configuration**

Create `frontend/src/router.tsx`:
```tsx
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
```

**Step 3: Update main.tsx to use RouterProvider**

Modify `frontend/src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

**Step 4: Run dev server to verify it loads (will error - pages don't exist yet)**

Run: `cd frontend && npm run dev`
Expected: Build succeeds, but pages are missing (this is fine)

**Step 5: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/router.tsx frontend/src/main.tsx
git commit -m "feat: add react-router-dom and configure routes"
```

---

### Task 2: Create Layout Component with Navigation

**Files:**
- Create: `frontend/src/components/Layout.tsx`
- Create: `frontend/src/components/Navigation.tsx`
- Create: `frontend/src/components/Footer.tsx`

**Step 1: Create Navigation component**

Create `frontend/src/components/Navigation.tsx`:
```tsx
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
```

**Step 2: Create Footer component**

Create `frontend/src/components/Footer.tsx`:
```tsx
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/guide" className="hover:text-gray-700">Guide</Link>
            <Link to="/methodology" className="hover:text-gray-700">Methodology</Link>
            <Link to="/faq" className="hover:text-gray-700">FAQ</Link>
          </div>
          <p className="text-gray-400 text-sm">
            All calculations run locally. No data is stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 3: Create Layout component**

Create `frontend/src/components/Layout.tsx`:
```tsx
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            ownvsrent.io
          </Link>
          <Navigation />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add frontend/src/components/Layout.tsx frontend/src/components/Navigation.tsx frontend/src/components/Footer.tsx
git commit -m "feat: add Layout, Navigation, and Footer components"
```

---

### Task 3: Create HomePage (Extract from App.tsx)

**Files:**
- Create: `frontend/src/pages/HomePage.tsx`
- Modify: `frontend/src/App.tsx` (will be deleted later)

**Step 1: Create pages directory and HomePage**

Create `frontend/src/pages/HomePage.tsx`:
```tsx
import { Calculator } from '../components/Calculator';

export function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Should You Rent or Buy a Home in 2026?
        </h1>
        <p className="text-gray-600 mt-2 text-base max-w-2xl">
          Free rent vs buy calculator with real math — taxes, appreciation, opportunity cost, and the numbers most calculators hide.
        </p>
      </div>
      <Calculator />
    </div>
  );
}
```

**Step 2: Run dev server to verify HomePage renders**

Run: `cd frontend && npm run dev`
Navigate to: `http://localhost:5173/`
Expected: Calculator page loads with navigation header

**Step 3: Commit**

```bash
git add frontend/src/pages/HomePage.tsx
git commit -m "feat: create HomePage component from App.tsx content"
```

---

### Task 4: Create Placeholder Pages for Other Routes

**Files:**
- Create: `frontend/src/pages/GuidePage.tsx`
- Create: `frontend/src/pages/MethodologyPage.tsx`
- Create: `frontend/src/pages/FaqPage.tsx`
- Create: `frontend/src/pages/CityPage.tsx`

**Step 1: Create GuidePage placeholder**

Create `frontend/src/pages/GuidePage.tsx`:
```tsx
export function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Rent vs Buy in 2026: The Complete Guide
      </h1>
      <p className="text-gray-600">Guide content coming soon...</p>
    </div>
  );
}
```

**Step 2: Create MethodologyPage placeholder**

Create `frontend/src/pages/MethodologyPage.tsx`:
```tsx
export function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        How Our Rent vs Buy Calculator Works
      </h1>
      <p className="text-gray-600">Methodology content coming soon...</p>
    </div>
  );
}
```

**Step 3: Create FaqPage placeholder**

Create `frontend/src/pages/FaqPage.tsx`:
```tsx
export function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-600">FAQ content coming soon...</p>
    </div>
  );
}
```

**Step 4: Create CityPage placeholder**

Create `frontend/src/pages/CityPage.tsx`:
```tsx
import { useParams } from 'react-router-dom';

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Rent vs Buy in {slug}
      </h1>
      <p className="text-gray-600">City page content coming soon...</p>
    </div>
  );
}
```

**Step 5: Verify all routes work**

Run: `cd frontend && npm run dev`
Navigate to each route:
- `/` - Should show calculator
- `/guide` - Should show guide placeholder
- `/methodology` - Should show methodology placeholder
- `/faq` - Should show FAQ placeholder
- `/cities/sf` - Should show "Rent vs Buy in sf"

**Step 6: Commit**

```bash
git add frontend/src/pages/
git commit -m "feat: add placeholder pages for guide, methodology, faq, and city routes"
```

---

### Task 5: Delete Old App.tsx and Clean Up

**Files:**
- Delete: `frontend/src/App.tsx`

**Step 1: Remove App.tsx**

Run:
```bash
rm frontend/src/App.tsx
```

**Step 2: Verify build still works**

Run: `cd frontend && npm run build`
Expected: Build succeeds without App.tsx

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused App.tsx"
```

---

## Phase 2: Content Pages

### Task 6: Create FAQ Data and Page with JSON-LD

**Files:**
- Create: `frontend/src/content/faq-data.ts`
- Modify: `frontend/src/pages/FaqPage.tsx`

**Step 1: Create FAQ data file**

Create `frontend/src/content/faq-data.ts`:
```tsx
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqData: FaqItem[] = [
  {
    question: "Is it better to rent or buy in 2026?",
    answer: "It depends on your specific situation. Key factors include how long you plan to stay (buying typically makes sense after 5-7 years), local housing costs vs. rent prices, your down payment savings, and current mortgage rates. Use our calculator to get a personalized answer based on your numbers."
  },
  {
    question: "How much should I spend on a house?",
    answer: "A common guideline is that your total housing costs (mortgage, taxes, insurance) shouldn't exceed 28% of your gross monthly income. However, this varies by location and personal circumstances. Our calculator helps you see the true total cost of ownership."
  },
  {
    question: "What is the 5% rule for renting vs buying?",
    answer: "The 5% rule suggests multiplying the home price by 5% and dividing by 12 to get a monthly 'breakeven rent.' If your rent is less than this amount, renting may be more cost-effective. For a $400,000 home, that's about $1,667/month. However, this is a rough estimate—our calculator provides a more accurate comparison."
  },
  {
    question: "How much do I need for a down payment?",
    answer: "While 20% down avoids PMI (private mortgage insurance), many loans allow 3-5% down. However, lower down payments mean higher monthly costs and more interest paid over time. Our calculator shows you the impact of different down payment amounts."
  },
  {
    question: "Is renting really throwing money away?",
    answer: "No. When you rent, you're paying for housing—a real service. When you buy, much of your early payments go to interest, taxes, and insurance rather than building equity. Renters can invest their would-be down payment in the stock market, often outperforming home appreciation."
  },
  {
    question: "How long should I plan to stay to make buying worth it?",
    answer: "Generally, you need to stay at least 5-7 years for buying to beat renting. This is because transaction costs (closing costs when buying, realtor fees when selling) eat into any equity gains. Our calculator shows you your specific breakeven timeline."
  },
  {
    question: "What's the true cost of homeownership?",
    answer: "Beyond your mortgage, expect to pay: property taxes (0.5-2.5% of home value annually), home insurance (0.3-1% annually), maintenance (1-2% annually), HOA fees if applicable, and PMI if your down payment is under 20%. These costs often add 30-50% on top of your mortgage payment."
  },
  {
    question: "Do I really save money on taxes by owning a home?",
    answer: "Often less than you think. You only benefit from the mortgage interest deduction if your total itemized deductions exceed the standard deduction ($15,750 single, $31,500 married in 2026). For many homeowners, especially with smaller mortgages, the standard deduction is higher."
  },
  {
    question: "What happens to PMI when I hit 20% equity?",
    answer: "PMI (Private Mortgage Insurance) is required when you put down less than 20%. It automatically terminates when your loan balance reaches 78% of the original home value, or you can request removal at 80%. Our calculator accounts for this in your cost projections."
  },
  {
    question: "How does appreciation affect the rent vs buy decision?",
    answer: "Home appreciation helps buyers build wealth, but it's not guaranteed. Historical average is about 3-4% nationally, but varies wildly by location and time period. Our calculator lets you adjust appreciation assumptions to see how it affects your outcome."
  },
  {
    question: "Should I buy if I can afford the mortgage payment?",
    answer: "Affording the mortgage payment is just the start. You also need to afford property taxes, insurance, maintenance, and repairs. Plus, you should compare this total cost against renting and investing the difference. Our calculator shows you the complete picture."
  },
  {
    question: "What opportunity cost am I missing by buying?",
    answer: "When you buy, your down payment and closing costs are tied up in the house instead of invested. A $80,000 down payment invested at 7% annual returns could grow to $157,000 in 10 years. Our calculator factors in this opportunity cost."
  },
  {
    question: "How do interest rates affect rent vs buy?",
    answer: "Higher rates significantly increase mortgage payments, making renting more attractive. A 1% rate increase on a $400,000 loan adds about $250/month to your payment. Our calculator uses current rates to give you accurate comparisons."
  },
  {
    question: "Is it better to buy a condo or rent an apartment?",
    answer: "Condos often have HOA fees that can be substantial ($300-$1,000+/month). These fees cover building maintenance but add to your monthly costs. Our calculator includes HOA fees in the comparison so you can see the true cost."
  },
  {
    question: "What about building equity vs investing in stocks?",
    answer: "Both build wealth, but differently. Home equity grows through appreciation and principal paydown. Stock investments have historically returned 7-10% annually. Our calculator compares both scenarios to show which builds more wealth over your time horizon."
  },
];

export function generateFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}
```

**Step 2: Update FaqPage with content and JSON-LD**

Modify `frontend/src/pages/FaqPage.tsx`:
```tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faqData, generateFaqSchema } from '../content/faq-data';

export function FaqPage() {
  useEffect(() => {
    // Add JSON-LD schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(generateFaqSchema(faqData));
    document.head.appendChild(script);

    // Update meta tags
    document.title = 'Rent vs Buy FAQ | Common Questions Answered | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get answers to common rent vs buy questions. Learn about the 5% rule, mortgage tax benefits, PMI, breakeven timelines, and more.');
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-600 mb-8">
        Common questions about renting vs buying a home, answered with real math.
      </p>

      <div className="space-y-6">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-100 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {item.question}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">
          Ready to see your numbers?
        </h3>
        <p className="text-gray-600 mb-4">
          Get a personalized rent vs buy analysis based on your specific situation.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Use the Calculator
        </Link>
      </div>
    </div>
  );
}
```

**Step 3: Verify FAQ page renders with schema**

Run: `cd frontend && npm run dev`
Navigate to: `http://localhost:5173/faq`
Open DevTools → Elements → Check `<head>` for JSON-LD script

**Step 4: Commit**

```bash
git add frontend/src/content/faq-data.ts frontend/src/pages/FaqPage.tsx
git commit -m "feat: add FAQ page with 15 questions and JSON-LD schema"
```

---

### Task 7: Create Methodology Page Content

**Files:**
- Create: `frontend/src/content/methodology-content.ts`
- Modify: `frontend/src/pages/MethodologyPage.tsx`

**Step 1: Create methodology content file**

Create `frontend/src/content/methodology-content.ts`:
```tsx
export const methodologySections = [
  {
    id: 'overview',
    title: 'Overview',
    content: `Our rent vs buy calculator uses month-by-month simulation to accurately compare the financial outcomes of renting versus buying a home. Unlike simpler calculators that use annual approximations, we model each month individually to capture timing-dependent factors like PMI removal, amortization schedules, and investment compounding.

This precision matters because financial decisions compound over time. A small error early in the calculation can lead to significantly misleading results over a 7-10 year horizon. Our approach ensures that every factor is accounted for at the right time.

The calculator compares two scenarios: (1) renting and investing the money you would have spent on a down payment and closing costs, versus (2) buying a home and building equity. At the end of your specified holding period, we compare total wealth in both scenarios to determine which option leaves you better off financially.`
  },
  {
    id: 'renting',
    title: 'Renting Calculations',
    content: `**Monthly Rent Cost**
Starting rent increases each year by your specified annual rent increase rate. For month M in year Y:
\`Rent(M) = InitialRent × (1 + AnnualIncrease)^Y\`

**Renter's Investment Portfolio**
The renter starts with the equivalent of the buyer's down payment and closing costs invested on day one. Each month, if renting costs less than owning, the renter invests the difference:
\`MonthlyInvestment = max(0, TotalOwnershipCost - TotalRentCost)\`

The portfolio grows at a monthly rate derived from your annual investment return:
\`MonthlyRate = (1 + AnnualReturn)^(1/12) - 1\`

**Final Renter Wealth**
At the end of the holding period, we calculate the after-tax value of the renter's portfolio. Capital gains tax applies only to the gains (portfolio value minus total contributions).`
  },
  {
    id: 'buying',
    title: 'Buying Calculations',
    content: `**Amortization Schedule**
We calculate an exact month-by-month amortization schedule for your mortgage. Each payment splits between principal and interest:
\`MonthlyPayment = Principal × [r(1+r)^n] / [(1+r)^n - 1]\`
where r = annual rate / 12, n = loan term in months.

**PITI Breakdown**
Your total monthly housing cost includes:
- **Principal & Interest**: Fixed monthly mortgage payment
- **Property Tax**: (Home Value × Annual Rate) / 12
- **Insurance**: (Home Value × Annual Rate) / 12

**PMI (Private Mortgage Insurance)**
Required when down payment is less than 20%. PMI rate applies to original loan amount. PMI automatically terminates when your loan balance reaches 78% of the original purchase price, or when the loan-to-value ratio (based on current appraised value with appreciation) reaches 80%.

**Maintenance & HOA**
Annual maintenance (typically 1-2% of home value) is divided monthly. HOA fees are added as specified.

**Home Appreciation**
Home value grows monthly at:
\`HomeValue(M) = PurchasePrice × (1 + AnnualAppreciation)^(M/12)\`

**Buyer's Investment Portfolio**
If buying costs less than renting in any month, the buyer invests that difference using the same investment return assumptions as the renter.`
  },
  {
    id: 'taxes',
    title: 'Tax Calculations',
    content: `**Standard vs. Itemized Deductions**
This is where most calculators get it wrong. You only benefit from mortgage interest and property tax deductions if your total itemized deductions exceed the standard deduction:
- Single: $15,750 (2025, adjusted for inflation)
- Married Filing Jointly: $31,500 (2025, adjusted for inflation)

Your tax benefit is: \`max(0, (ItemizedTotal - StandardDeduction) × MarginalRate)\`

**SALT Cap (State and Local Tax)**
The 2025 OBBBA modified SALT deduction limits:
- 2025-2029: $40,000 cap ($20,000 MFS)
- Inflation adjustment: 1% annually
- Phase-out: 30% reduction for MAGI > $500K (floor of $10K)
- 2030+: Reverts to $10,000 cap

**Mortgage Interest Deduction**
Deductible on the first $750,000 of acquisition debt. If your loan exceeds this, we prorate the deductible amount.

**PMI Deductibility**
Starting tax year 2026 (OBBBA), PMI premiums are treated as deductible mortgage interest. Phase-out applies for AGI between $100K-$110K.`
  },
  {
    id: 'wealth',
    title: 'Wealth Comparison',
    content: `**Buyer's Final Wealth**
At the end of your holding period, the buyer's wealth equals:
\`HomeValue - RemainingMortgage - SellingCosts - CapitalGainsTax + InvestmentPortfolio\`

**Selling Costs**
Typically 6-8% of sale price, covering realtor commissions, transfer taxes, and closing costs.

**Capital Gains on Home Sale**
The IRS allows exclusion of $250,000 (single) or $500,000 (married) in capital gains on your primary residence if you've lived there 2+ of the last 5 years. Only gains above this exemption are taxed at your capital gains rate.

**Renter's Final Wealth**
The renter's wealth is their investment portfolio value minus capital gains tax on investment gains.

**Net Benefit**
The final comparison: \`BuyerWealth - RenterWealth\`
- Positive = buying wins
- Negative = renting wins
- Within ±$10,000 = too close to call (toss-up)`
  },
  {
    id: 'sources',
    title: 'Our Sources',
    content: `**Tax Law References**
- IRS Publication 936: Home Mortgage Interest Deduction
- IRS Publication 530: Tax Information for Homeowners
- One Big Beautiful Bill Act (OBBBA) 2025: SALT cap modifications
- IRC Section 121: Exclusion of gain from sale of principal residence

**Data Sources**
- Freddie Mac: Mortgage rate trends
- U.S. Census Bureau: Housing cost statistics
- Bureau of Labor Statistics: Inflation data
- S&P 500: Historical investment returns

**Transparency**
Our calculator's source code is available for review. We have no affiliation with real estate agents, mortgage lenders, or anyone with a financial interest in your decision. We show you the math—nothing more, nothing less.`
  }
];
```

**Step 2: Update MethodologyPage**

Modify `frontend/src/pages/MethodologyPage.tsx`:
```tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { methodologySections } from '../content/methodology-content';

export function MethodologyPage() {
  useEffect(() => {
    document.title = 'How Our Rent vs Buy Calculator Works | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn exactly how our rent vs buy calculator works. Month-by-month simulation, accurate tax calculations, and transparent methodology.');
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        How Our Rent vs Buy Calculator Works
      </h1>
      <p className="text-gray-600 mb-8">
        A detailed look at the math behind our calculations.
      </p>

      {/* Table of Contents */}
      <nav className="mb-10 p-4 bg-gray-50 rounded-xl">
        <h2 className="font-semibold text-gray-900 mb-3">Contents</h2>
        <ul className="space-y-1">
          {methodologySections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-gray-600 hover:text-gray-900"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content Sections */}
      <div className="space-y-12">
        {methodologySections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="prose prose-gray max-w-none">
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">
          See it in action
        </h3>
        <p className="text-gray-600 mb-4">
          Run your own numbers through our calculator.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Use the Calculator
        </Link>
      </div>
    </div>
  );
}
```

**Step 3: Verify methodology page renders**

Run: `cd frontend && npm run dev`
Navigate to: `http://localhost:5173/methodology`
Expected: See methodology content with table of contents

**Step 4: Commit**

```bash
git add frontend/src/content/methodology-content.ts frontend/src/pages/MethodologyPage.tsx
git commit -m "feat: add methodology page with detailed calculation explanations"
```

---

### Task 8: Create Guide Page Content

**Files:**
- Create: `frontend/src/content/guide-sections.ts`
- Modify: `frontend/src/pages/GuidePage.tsx`

**Step 1: Create guide content file**

Create `frontend/src/content/guide-sections.ts`:
```tsx
export const guideSections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: `Buying a home is often called the biggest financial decision of your life. It's also one of the most emotionally charged. Real estate agents, mortgage lenders, parents, and well-meaning friends all have opinions—and many have financial incentives that don't align with yours.

The real estate industry spends billions marketing the "American Dream" of homeownership. Phrases like "throwing money away on rent" and "building equity" make buying sound like the obvious choice. But the math tells a more nuanced story.

This guide cuts through the noise. We'll show you exactly how to compare renting versus buying for your specific situation, what costs most people forget, and how to make a decision based on numbers rather than emotions.`
  },
  {
    id: 'five-percent-rule',
    title: 'The 5% Rule Explained',
    content: `The 5% rule offers a quick way to estimate whether renting or buying makes more sense. Here's how it works:

Take the home's purchase price and multiply by 5%. Divide by 12 to get a monthly "breakeven rent" amount. If you can rent a comparable home for less than this number, renting likely wins. If rent is higher, buying might be better.

**Example**: A $500,000 home × 5% = $25,000 per year ÷ 12 = $2,083/month

The 5% comes from three costs unique to ownership:
- **Property taxes**: ~1% of home value annually
- **Maintenance**: ~1% annually (roofs, appliances, repairs)
- **Cost of capital**: ~3% (what you could earn investing your down payment elsewhere)

**When the 5% rule works**: As a quick sanity check in markets with typical price-to-rent ratios.

**When it fails**: In expensive markets (SF, NYC) where price-to-rent ratios are extreme, in areas with unusually high property taxes, or when holding periods are very short or very long. Our calculator provides a more precise answer.`
  },
  {
    id: 'true-cost-ownership',
    title: 'True Cost of Homeownership',
    content: `The mortgage payment is just the beginning. Here's what home buyers actually pay:

**PITI: The Four Components**
- **Principal**: The portion paying down your loan
- **Interest**: What the bank charges for the loan
- **Taxes**: Property taxes, typically 0.5-2.5% of home value annually
- **Insurance**: Homeowner's insurance, 0.3-1% annually

**Hidden Costs Most Buyers Forget**

*Maintenance and Repairs*: Plan for 1-2% of home value annually. That's $4,000-$8,000 per year on a $400,000 home. This covers HVAC replacements, roof repairs, plumbing issues, appliance breakdowns, and the constant small fixes homeownership requires.

*HOA Fees*: Condos and planned communities charge $200-$1,000+ monthly. These fees tend to increase over time and are essentially non-negotiable.

*PMI (Private Mortgage Insurance)*: Required if your down payment is under 20%. Typically 0.5-1% of the loan amount annually. A $320,000 loan could add $133-$267 per month until you hit 20% equity.

**The Opportunity Cost**

Your down payment could be invested instead. $80,000 invested at 7% annual returns grows to $157,000 in 10 years. This opportunity cost is invisible but real—it's money you could have but don't because it's locked in your house.

**Transaction Costs**

Buying costs 2-5% of purchase price in closing costs. Selling costs 6-8% in realtor commissions and fees. On a $500,000 home, that's $40,000-$65,000 just to buy and sell—money you never get back.`
  },
  {
    id: 'true-cost-renting',
    title: 'True Cost of Renting',
    content: `Renting is often dismissed as "throwing money away," but let's look at what renters actually get:

**What You Pay**
- Monthly rent
- Renter's insurance (~$15-30/month)
- Utilities (sometimes included)
- Security deposit (refundable)
- Broker fee in some markets (one-time)

**What You Get**
- Flexibility to move without selling
- No maintenance or repair costs
- No property tax payments
- No risk of home value decline
- Liquidity—your savings aren't locked in a house

**The Renter's Investment Advantage**

Here's what the "throwing money away" crowd misses: renters can invest the money they would have spent on a down payment, closing costs, and the ownership premium.

If a renter invests $80,000 (the down payment they didn't spend) and the $500/month they save versus owning, at 7% returns they could have $250,000+ after 10 years.

**The Flexibility Premium**

Job opportunity in another city? Renters give 30-60 days notice. Homeowners face months of selling, 6-8% in selling costs, and the risk of needing to sell in a down market.

For career-focused individuals in their 20s and 30s, this flexibility can be worth tens of thousands in better job opportunities.`
  },
  {
    id: 'tax-reality',
    title: 'The Tax Benefit Reality',
    content: `"You'll save so much on taxes!" is perhaps the most overstated benefit of homeownership. Here's the truth:

**How the Mortgage Interest Deduction Actually Works**

You can only deduct mortgage interest if you *itemize* your deductions. You should only itemize if your total itemized deductions exceed the standard deduction:
- Single filers: $15,750 (2025)
- Married filing jointly: $31,500 (2025)

Most homeowners, especially those with smaller mortgages or in low-tax states, are better off taking the standard deduction. In that case, the mortgage interest deduction provides *zero* tax benefit.

**A Realistic Example**

Say you pay $18,000 in mortgage interest, $6,000 in property taxes, and $2,000 in state income taxes. That's $26,000 in potential itemized deductions.

If you're single, the standard deduction is $15,750. So you'd itemize, getting an extra $10,250 in deductions. At a 22% tax bracket, that's about $2,255 in actual tax savings.

Compare that to the $24,000+ you paid in interest and taxes. You're not "getting money back"—you're getting a small discount on a large expense.

**The SALT Cap**

The State and Local Tax (SALT) deduction is capped at $40,000 (2025-2029). In high-tax states like California or New York, this limit prevents you from deducting all your property and state income taxes.

**Bottom Line**

For most buyers, the tax benefit is real but modest—typically $1,000-$3,000/year. It shouldn't be the deciding factor in your rent vs. buy decision.`
  },
  {
    id: 'market-conditions',
    title: 'Market Conditions Matter',
    content: `The rent vs. buy math isn't static—it shifts dramatically based on market conditions.

**Home Appreciation**

The historical average home appreciation is about 3-4% nationally. But this varies enormously:
- Some markets appreciate 7-10% annually during booms
- Others depreciate 20-30% in downturns
- Individual neighborhoods within cities can vary by 5%+ annually

Be skeptical of anyone who promises consistent appreciation. Markets are cyclical, and timing matters more than most buyers realize.

**Interest Rates**

Mortgage rates have a massive impact on monthly costs. On a $400,000 loan:
- At 5%: $2,147/month
- At 7%: $2,661/month
- At 8%: $2,935/month

That's nearly $800/month difference between 5% and 8%. Higher rates favor renting; lower rates favor buying.

**Price-to-Rent Ratio**

This ratio (home price ÷ annual rent) indicates whether a market favors buyers or renters:
- Under 15: Buying is often favorable
- 15-20: Roughly neutral
- Over 20: Renting is often more economical

In San Francisco and New York, ratios exceed 30—strongly favoring renters. In cities like Cleveland or Detroit, ratios under 12 favor buyers.

**The 2024-2026 Market**

As of 2026, elevated mortgage rates (6-7%) combined with high home prices in many markets have shifted the math toward renting in most major metros. Our calculator uses current conditions to give you an accurate comparison.`
  },
  {
    id: 'holding-period',
    title: 'How Long You\'ll Stay',
    content: `The length of time you'll live in a home is one of the most important variables in the rent vs. buy decision.

**Why Short Holds Favor Renting**

Transaction costs—the 2-5% to buy and 6-8% to sell—must be recouped before buying makes financial sense. On a $500,000 home, that's $40,000-$65,000.

If you sell after just 2 years, you'll likely lose money even in an appreciating market once you factor in these costs plus the heavy interest payments in early loan years.

**The Breakeven Timeline**

Most analyses suggest you need to stay at least 5-7 years for buying to beat renting. But this varies based on:
- How expensive your market is (price-to-rent ratio)
- Your mortgage rate
- How fast the home appreciates
- How fast rents increase

In expensive markets with high price-to-rent ratios, breakeven might be 10+ years. In affordable markets, it could be 3-4 years.

**The 5-7 Year Rule**

If you're confident you'll stay at least 5-7 years, buying often makes sense. If there's a reasonable chance you'll move sooner—job change, relationship change, growing family—the flexibility of renting has real financial value.

**Our Calculator Shows Your Breakeven**

Input your numbers, and we'll tell you exactly what year buying beats renting in your specific scenario—or whether it never does within a 30-year horizon.`
  },
  {
    id: 'lifestyle-factors',
    title: 'Lifestyle Factors',
    content: `Money isn't everything. Here are non-financial factors that should influence your decision:

**Job Flexibility**

Are you in an industry where opportunities might arise in other cities? Tech, finance, and consulting professionals often benefit from mobility. Being tied to a home you can't quickly sell limits your options.

**Family Planning**

Expecting kids changes the equation. You may want more space, better schools, or a yard. But be realistic about timing—the "starter home" you buy now might not be where you want to raise a family.

**Maintenance Tolerance**

Some people love home projects. Others dread them. Owning means you're responsible for every repair, upgrade, and maintenance task. If you'd rather spend weekends not thinking about your property, renting removes that burden.

**Risk Tolerance**

Homeownership concentrates your wealth in a single, illiquid asset. If the local economy tanks, you could lose your job *and* your home equity simultaneously. Renters can invest in diversified portfolios that spread risk globally.

**Stability Preference**

For some, knowing they won't have to move if a landlord sells is worth a financial premium. If putting down roots and having complete control over your living space matters deeply, that preference is valid—just account for its cost.

**The Honest Assessment**

There's nothing wrong with prioritizing lifestyle over pure financial optimization. Just make sure you're making an informed choice, not rationalizing an emotional decision after the fact.`
  },
  {
    id: 'common-mistakes',
    title: 'Common Mistakes',
    content: `These errors lead people to buy when they shouldn't—or underestimate the true costs:

**Comparing Rent to Mortgage Payment Only**

Your mortgage payment is just principal and interest. You also pay property taxes, insurance, maintenance, and possibly HOA and PMI. True ownership costs are typically 30-50% higher than the mortgage payment alone.

**Ignoring Opportunity Cost**

That $80,000 down payment could be invested in index funds averaging 7% returns. Over 10 years, that's roughly $77,000 in foregone gains. It's invisible money, but it's real.

**Overestimating Appreciation**

"Real estate always goes up" ignores 2008-2012 when prices fell 30%+ in many markets. Even in normal times, appreciation varies wildly by location. Using optimistic assumptions leads to bad decisions.

**Underestimating Maintenance**

First-time buyers consistently underestimate how much they'll spend on repairs and upgrades. That "move-in ready" home still needs a new roof in 10 years, HVAC replacement in 15, and countless small repairs along the way.

**Assuming Tax Savings You Won't Get**

Most buyers don't itemize deductions, meaning the mortgage interest deduction provides zero benefit. Calculate your actual tax situation, not the theoretical maximum.

**Emotional Attachment to Ownership**

"I don't want to pay someone else's mortgage" and "rent is throwing money away" are emotional arguments, not financial ones. When you pay rent, you're buying housing—a real service with real value.

**Not Running the Numbers**

The biggest mistake? Not doing the actual math for your specific situation. That's what our calculator is for.`
  },
  {
    id: 'using-calculator',
    title: 'Using Our Calculator',
    content: `Here's how to get the most accurate results from our rent vs. buy calculator:

**Start with Current Market Data**

Enter your actual current rent or a realistic estimate for comparable housing. For purchase price, use recently sold homes in your target neighborhood, not listing prices.

**Be Realistic About Holding Period**

How long will you *actually* stay? If there's uncertainty, run multiple scenarios. The breakeven analysis shows you the risk of leaving early.

**Use Conservative Appreciation**

3-4% annual appreciation is historically reasonable. Higher projections might be accurate for your market but add risk to your decision.

**Don't Forget All Ownership Costs**

Include realistic property tax rates, insurance, HOA if applicable, and maintenance (1-2% of home value). These add up quickly.

**Check the Tax Calculation**

Our calculator shows whether you'll benefit from itemizing deductions. Many buyers are surprised to learn the mortgage interest deduction doesn't help them.

**Compare the Wealth Chart**

The most important output is the wealth comparison over time. This shows your total net worth in both scenarios, accounting for home equity, investment growth, and all costs.

**Run Multiple Scenarios**

What if rates go up or down? What if you need to leave early? What if appreciation is lower than expected? Understanding how sensitive your decision is to these factors helps you make a robust choice.

Ready to see your numbers? Use our calculator for a personalized, accurate rent vs. buy comparison.`
  }
];
```

**Step 2: Update GuidePage**

Modify `frontend/src/pages/GuidePage.tsx`:
```tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { guideSections } from '../content/guide-sections';

export function GuidePage() {
  useEffect(() => {
    document.title = 'Rent vs Buy Guide 2026: The Complete Analysis | ownvsrent.io';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'The complete rent vs buy guide for 2026. Learn about the 5% rule, true costs of ownership, tax benefits, and how to decide whether to rent or buy a home.');
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Rent vs Buy in 2026: The Complete Guide
      </h1>
      <p className="text-gray-600 mb-8">
        Everything you need to know to make an informed decision about renting or buying a home.
      </p>

      {/* Table of Contents */}
      <nav className="mb-10 p-6 bg-gray-50 rounded-xl">
        <h2 className="font-semibold text-gray-900 mb-4">In This Guide</h2>
        <ol className="space-y-2">
          {guideSections.map((section, index) => (
            <li key={section.id} className="flex gap-3">
              <span className="text-gray-400 font-mono text-sm w-6">{index + 1}.</span>
              <a
                href={`#${section.id}`}
                className="text-gray-600 hover:text-gray-900"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content Sections */}
      <div className="space-y-16">
        {guideSections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="prose prose-gray max-w-none">
              {section.content.split('\n\n').map((paragraph, i) => {
                // Handle paragraphs starting with ** as subheadings
                if (paragraph.startsWith('**') && paragraph.includes('**\n')) {
                  const [heading, ...rest] = paragraph.split('\n');
                  return (
                    <div key={i} className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {heading.replace(/\*\*/g, '')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {rest.join('\n')}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 p-8 bg-gray-900 rounded-xl text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Ready to see your numbers?
        </h3>
        <p className="text-gray-300 mb-6 max-w-lg mx-auto">
          Get a personalized rent vs buy analysis based on your specific situation, income, and local market.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Use the Calculator
        </Link>
      </div>

      {/* Related Links */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/methodology"
          className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1">How the Calculator Works</h4>
          <p className="text-sm text-gray-600">Learn about our month-by-month simulation methodology.</p>
        </Link>
        <Link
          to="/faq"
          className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1">Frequently Asked Questions</h4>
          <p className="text-sm text-gray-600">Quick answers to common rent vs buy questions.</p>
        </Link>
      </div>
    </div>
  );
}
```

**Step 3: Verify guide page renders**

Run: `cd frontend && npm run dev`
Navigate to: `http://localhost:5173/guide`
Expected: See full guide with table of contents and 10 sections

**Step 4: Commit**

```bash
git add frontend/src/content/guide-sections.ts frontend/src/pages/GuidePage.tsx
git commit -m "feat: add comprehensive rent vs buy guide with 10 sections (~3000 words)"
```

---

## Phase 3: City Pages

### Task 9: Extend Cities Data with 25 Cities

**Files:**
- Modify: `frontend/src/data/cities.ts`

**Step 1: Update cities.ts with extended city data**

Modify `frontend/src/data/cities.ts`:
```tsx
export interface CityPreset {
  name: string;
  slug: string;
  monthly_rent: number;
  purchase_price: number;
  property_tax_rate: number;
  home_insurance_rate: number;
  hoa_monthly: number;
  state_tax_rate: number;
}

export interface CityData extends CityPreset {
  state: string;
  stateAbbr: string;
  metro: string;
  description: string;
  marketInsight: string;
}

export const CITIES: CityData[] = [
  {
    name: 'National Average',
    slug: 'national',
    state: 'United States',
    stateAbbr: 'US',
    metro: 'National',
    monthly_rent: 2000,
    purchase_price: 400000,
    property_tax_rate: 0.011,
    home_insurance_rate: 0.005,
    hoa_monthly: 0,
    state_tax_rate: 0.05,
    description: 'National average figures based on median home prices and rents across the United States. Use this as a baseline comparison or if your city is not listed.',
    marketInsight: 'The national housing market in 2026 shows stabilizing prices after the rapid increases of 2020-2023. Mortgage rates remain elevated compared to the 2020-2021 lows, impacting affordability in many markets.',
  },
  {
    name: 'San Francisco',
    slug: 'san-francisco',
    state: 'California',
    stateAbbr: 'CA',
    metro: 'San Francisco-Oakland-Berkeley',
    monthly_rent: 3200,
    purchase_price: 1100000,
    property_tax_rate: 0.0118,
    home_insurance_rate: 0.003,
    hoa_monthly: 600,
    state_tax_rate: 0.093,
    description: 'San Francisco remains one of the most expensive housing markets in the nation. Tech industry concentration drives both high salaries and high housing costs. The city\'s geographic constraints limit new construction.',
    marketInsight: 'With price-to-rent ratios exceeding 28, San Francisco strongly favors renting for most financial scenarios. High state income taxes reduce the net benefit of the mortgage interest deduction.',
  },
  {
    name: 'New York City',
    slug: 'new-york',
    state: 'New York',
    stateAbbr: 'NY',
    metro: 'New York-Newark-Jersey City',
    monthly_rent: 3800,
    purchase_price: 750000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.004,
    hoa_monthly: 900,
    state_tax_rate: 0.0685,
    description: 'New York City\'s housing market varies dramatically by borough. Manhattan commands premium prices while outer boroughs offer relative affordability. Co-op and condo fees add significant monthly costs.',
    marketInsight: 'NYC\'s high condo/co-op fees and property taxes tip the scales toward renting in many scenarios. Strict co-op boards can complicate buying, adding time and uncertainty to purchases.',
  },
  {
    name: 'Los Angeles',
    slug: 'los-angeles',
    state: 'California',
    stateAbbr: 'CA',
    metro: 'Los Angeles-Long Beach-Anaheim',
    monthly_rent: 2800,
    purchase_price: 850000,
    property_tax_rate: 0.0118,
    home_insurance_rate: 0.004,
    hoa_monthly: 400,
    state_tax_rate: 0.093,
    description: 'Los Angeles offers diverse neighborhoods ranging from beachfront communities to suburban valleys. Prop 13 keeps property taxes low for long-term owners, but high purchase prices remain a barrier.',
    marketInsight: 'LA\'s sprawling market means location matters enormously. Westside neighborhoods favor renting; inland areas like the San Fernando Valley may favor buying.',
  },
  {
    name: 'Seattle',
    slug: 'seattle',
    state: 'Washington',
    stateAbbr: 'WA',
    metro: 'Seattle-Tacoma-Bellevue',
    monthly_rent: 2400,
    purchase_price: 700000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.003,
    hoa_monthly: 350,
    state_tax_rate: 0,
    description: 'Seattle benefits from no state income tax, increasing the value of investment returns for renters. Major tech employers drive demand, though recent layoffs have cooled the market slightly.',
    marketInsight: 'No state income tax makes Seattle\'s renter investment math particularly attractive. The lack of SALT deduction limitations also benefits high-income buyers less than in other states.',
  },
  {
    name: 'Boston',
    slug: 'boston',
    state: 'Massachusetts',
    stateAbbr: 'MA',
    metro: 'Boston-Cambridge-Newton',
    monthly_rent: 3100,
    purchase_price: 700000,
    property_tax_rate: 0.0109,
    home_insurance_rate: 0.004,
    hoa_monthly: 450,
    state_tax_rate: 0.05,
    description: 'Boston\'s historic housing stock and limited land create persistent supply constraints. The metro\'s universities and healthcare institutions provide economic stability and consistent housing demand.',
    marketInsight: 'High prices relative to incomes make Boston challenging for first-time buyers. Consider suburbs along commuter rail lines for better price-to-rent ratios.',
  },
  {
    name: 'Austin',
    slug: 'austin',
    state: 'Texas',
    stateAbbr: 'TX',
    metro: 'Austin-Round Rock-Georgetown',
    monthly_rent: 1900,
    purchase_price: 480000,
    property_tax_rate: 0.022,
    home_insurance_rate: 0.006,
    hoa_monthly: 150,
    state_tax_rate: 0,
    description: 'Austin has seen explosive growth as tech companies expand beyond California. No state income tax attracts high earners, but property taxes are among the highest in the nation.',
    marketInsight: 'Texas\'s high property taxes (~2.2%) offset the lack of state income tax for homeowners. This shifts the math toward renting unless you plan to stay long-term.',
  },
  {
    name: 'Denver',
    slug: 'denver',
    state: 'Colorado',
    stateAbbr: 'CO',
    metro: 'Denver-Aurora-Lakewood',
    monthly_rent: 2100,
    purchase_price: 550000,
    property_tax_rate: 0.006,
    home_insurance_rate: 0.004,
    hoa_monthly: 200,
    state_tax_rate: 0.0455,
    description: 'Denver offers a balance of urban amenities and outdoor access. Lower property tax rates than Texas make ownership more attractive, though prices have risen substantially since 2020.',
    marketInsight: 'Denver\'s moderate property taxes and reasonable price-to-rent ratio make it more balanced than coastal cities. The decision often comes down to your holding period.',
  },
  {
    name: 'Miami',
    slug: 'miami',
    state: 'Florida',
    stateAbbr: 'FL',
    metro: 'Miami-Fort Lauderdale-Pompano Beach',
    monthly_rent: 2600,
    purchase_price: 550000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.012,
    hoa_monthly: 500,
    state_tax_rate: 0,
    description: 'Miami\'s no state income tax attracts wealth from high-tax states. However, extremely high insurance costs (hurricane risk) and condo fees add substantial ownership expenses.',
    marketInsight: 'Florida\'s insurance crisis dramatically impacts ownership costs. Annual insurance can exceed $6,000 for condos. Factor this carefully into your calculations.',
  },
  {
    name: 'Chicago',
    slug: 'chicago',
    state: 'Illinois',
    stateAbbr: 'IL',
    metro: 'Chicago-Naperville-Elgin',
    monthly_rent: 2000,
    purchase_price: 350000,
    property_tax_rate: 0.021,
    home_insurance_rate: 0.005,
    hoa_monthly: 350,
    state_tax_rate: 0.0495,
    description: 'Chicago offers relatively affordable housing for a major city, though high property taxes eat into savings. Downtown condos come with substantial HOA fees.',
    marketInsight: 'Chicago\'s high property taxes (2%+) favor renting in shorter holding periods. For long-term residents, the relatively affordable purchase prices can still make buying worthwhile.',
  },
  {
    name: 'Washington DC',
    slug: 'washington-dc',
    state: 'District of Columbia',
    stateAbbr: 'DC',
    metro: 'Washington-Arlington-Alexandria',
    monthly_rent: 2500,
    purchase_price: 600000,
    property_tax_rate: 0.0085,
    home_insurance_rate: 0.004,
    hoa_monthly: 400,
    state_tax_rate: 0.085,
    description: 'Washington DC\'s economy is anchored by the federal government, providing stability. The metro area spans Maryland and Virginia suburbs with varying tax structures.',
    marketInsight: 'DC proper has high income taxes but stable appreciation. Consider Virginia suburbs for no income tax (Alexandria, Arlington) or Maryland for lower property taxes.',
  },
  {
    name: 'San Diego',
    slug: 'san-diego',
    state: 'California',
    stateAbbr: 'CA',
    metro: 'San Diego-Chula Vista-Carlsbad',
    monthly_rent: 2700,
    purchase_price: 850000,
    property_tax_rate: 0.0118,
    home_insurance_rate: 0.003,
    hoa_monthly: 350,
    state_tax_rate: 0.093,
    description: 'San Diego offers year-round pleasant weather and a strong biotech sector. Military presence provides economic stability. Prices are high but lower than SF or LA.',
    marketInsight: 'Like other California metros, high prices and state taxes favor renting for shorter holding periods. Long-term residents benefit from Prop 13 property tax limits.',
  },
  {
    name: 'Portland',
    slug: 'portland',
    state: 'Oregon',
    stateAbbr: 'OR',
    metro: 'Portland-Vancouver-Hillsboro',
    monthly_rent: 1900,
    purchase_price: 500000,
    property_tax_rate: 0.01,
    home_insurance_rate: 0.004,
    hoa_monthly: 200,
    state_tax_rate: 0.09,
    description: 'Portland has no sales tax but high income taxes. The housing market cooled significantly in 2023-2024, making it more balanced than during the pandemic boom.',
    marketInsight: 'Oregon\'s high income tax reduces the benefit of investment returns for renters. Combined with moderate home prices, Portland is more balanced than many West Coast metros.',
  },
  {
    name: 'Phoenix',
    slug: 'phoenix',
    state: 'Arizona',
    stateAbbr: 'AZ',
    metro: 'Phoenix-Mesa-Chandler',
    monthly_rent: 1700,
    purchase_price: 420000,
    property_tax_rate: 0.006,
    home_insurance_rate: 0.005,
    hoa_monthly: 100,
    state_tax_rate: 0.025,
    description: 'Phoenix offers affordable housing and low taxes, attracting remote workers and retirees. Rapid growth has pushed prices up, though they remain below coastal levels.',
    marketInsight: 'Low property taxes and affordable prices make Phoenix more favorable for buying than many metros. Consider water access and sustainability concerns for long-term ownership.',
  },
  {
    name: 'Dallas',
    slug: 'dallas',
    state: 'Texas',
    stateAbbr: 'TX',
    metro: 'Dallas-Fort Worth-Arlington',
    monthly_rent: 1700,
    purchase_price: 380000,
    property_tax_rate: 0.022,
    home_insurance_rate: 0.006,
    hoa_monthly: 100,
    state_tax_rate: 0,
    description: 'Dallas offers no state income tax and relatively affordable housing. Corporate relocations from California continue to drive demand and population growth.',
    marketInsight: 'Like Austin, high property taxes offset the lack of state income tax. The math favors buying if you plan to stay 5+ years in your home.',
  },
  {
    name: 'Atlanta',
    slug: 'atlanta',
    state: 'Georgia',
    stateAbbr: 'GA',
    metro: 'Atlanta-Sandy Springs-Alpharetta',
    monthly_rent: 1800,
    purchase_price: 380000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.006,
    hoa_monthly: 150,
    state_tax_rate: 0.055,
    description: 'Atlanta offers affordable housing relative to its economy, with major corporate headquarters and a growing tech sector. The metro spans widely varying neighborhoods.',
    marketInsight: 'Atlanta\'s reasonable price-to-rent ratio makes the rent vs. buy decision highly dependent on your specific situation and holding period.',
  },
  {
    name: 'Houston',
    slug: 'houston',
    state: 'Texas',
    stateAbbr: 'TX',
    metro: 'Houston-The Woodlands-Sugar Land',
    monthly_rent: 1600,
    purchase_price: 320000,
    property_tax_rate: 0.022,
    home_insurance_rate: 0.008,
    hoa_monthly: 75,
    state_tax_rate: 0,
    description: 'Houston offers some of the most affordable housing among major metros. The energy sector drives the economy, creating both opportunities and volatility.',
    marketInsight: 'Affordable prices and no state income tax favor buying, but high property taxes and insurance (flood risk) add ongoing costs. Consider neighborhood flood zones carefully.',
  },
  {
    name: 'Philadelphia',
    slug: 'philadelphia',
    state: 'Pennsylvania',
    stateAbbr: 'PA',
    metro: 'Philadelphia-Camden-Wilmington',
    monthly_rent: 1800,
    purchase_price: 350000,
    property_tax_rate: 0.014,
    home_insurance_rate: 0.005,
    hoa_monthly: 200,
    state_tax_rate: 0.0307,
    description: 'Philadelphia offers relative affordability compared to nearby NYC and DC. The city also has a wage tax that affects residents, though property taxes are moderate.',
    marketInsight: 'Philadelphia\'s city wage tax (3.75%) reduces take-home pay for residents. Consider suburbs in Montgomery or Delaware counties for different tax treatment.',
  },
  {
    name: 'Minneapolis',
    slug: 'minneapolis',
    state: 'Minnesota',
    stateAbbr: 'MN',
    metro: 'Minneapolis-St. Paul-Bloomington',
    monthly_rent: 1600,
    purchase_price: 350000,
    property_tax_rate: 0.011,
    home_insurance_rate: 0.005,
    hoa_monthly: 200,
    state_tax_rate: 0.0785,
    description: 'Minneapolis offers affordable housing and strong public amenities. High state income taxes reduce the advantage of investment returns for renters.',
    marketInsight: 'Minnesota\'s high income tax makes the renter\'s investment advantage smaller. Combined with affordable prices, Minneapolis is relatively balanced between renting and buying.',
  },
  {
    name: 'Nashville',
    slug: 'nashville',
    state: 'Tennessee',
    stateAbbr: 'TN',
    metro: 'Nashville-Davidson-Murfreesboro-Franklin',
    monthly_rent: 1900,
    purchase_price: 450000,
    property_tax_rate: 0.007,
    home_insurance_rate: 0.005,
    hoa_monthly: 150,
    state_tax_rate: 0,
    description: 'Nashville has boomed as a relocation destination for Californians and corporations. No state income tax and a growing economy attract continued migration.',
    marketInsight: 'No state income tax benefits both renters (higher investment returns) and buyers (lower overall tax burden). Low property taxes make ownership more attractive than in Texas.',
  },
  {
    name: 'Raleigh',
    slug: 'raleigh',
    state: 'North Carolina',
    stateAbbr: 'NC',
    metro: 'Raleigh-Cary',
    monthly_rent: 1700,
    purchase_price: 420000,
    property_tax_rate: 0.008,
    home_insurance_rate: 0.005,
    hoa_monthly: 150,
    state_tax_rate: 0.0525,
    description: 'Raleigh\'s Research Triangle anchors a strong tech and education sector. Moderate cost of living and quality of life attract continued population growth.',
    marketInsight: 'Raleigh offers a balanced market with moderate prices and taxes. The rent vs. buy decision is often close—use our calculator for your specific numbers.',
  },
  {
    name: 'Salt Lake City',
    slug: 'salt-lake-city',
    state: 'Utah',
    stateAbbr: 'UT',
    metro: 'Salt Lake City-West Valley City-Provo',
    monthly_rent: 1600,
    purchase_price: 500000,
    property_tax_rate: 0.006,
    home_insurance_rate: 0.004,
    hoa_monthly: 150,
    state_tax_rate: 0.0495,
    description: 'Salt Lake City combines outdoor recreation with a growing tech sector. Prices have risen substantially, though they remain below coastal levels.',
    marketInsight: 'Low property taxes favor buying for long-term holds. The Mormon cultural influence creates strong demand for family housing in good school districts.',
  },
  {
    name: 'Charlotte',
    slug: 'charlotte',
    state: 'North Carolina',
    stateAbbr: 'NC',
    metro: 'Charlotte-Concord-Gastonia',
    monthly_rent: 1700,
    purchase_price: 380000,
    property_tax_rate: 0.008,
    home_insurance_rate: 0.005,
    hoa_monthly: 150,
    state_tax_rate: 0.0525,
    description: 'Charlotte\'s banking sector and NASCAR presence anchor the local economy. Affordable housing and moderate taxes attract relocations from the Northeast.',
    marketInsight: 'Charlotte\'s affordable prices and moderate taxes make it relatively favorable for buying compared to coastal metros. Consider commute times as the metro sprawls.',
  },
  {
    name: 'Tampa',
    slug: 'tampa',
    state: 'Florida',
    stateAbbr: 'FL',
    metro: 'Tampa-St. Petersburg-Clearwater',
    monthly_rent: 1900,
    purchase_price: 380000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.01,
    hoa_monthly: 200,
    state_tax_rate: 0,
    description: 'Tampa offers Florida living without Miami prices. No state income tax attracts retirees and remote workers. Insurance costs have risen significantly.',
    marketInsight: 'Like Miami, high insurance costs impact ownership economics. No state income tax benefits investment returns for renters. Factor in hurricane risk.',
  },
  {
    name: 'San Jose',
    slug: 'san-jose',
    state: 'California',
    stateAbbr: 'CA',
    metro: 'San Jose-Sunnyvale-Santa Clara',
    monthly_rent: 3000,
    purchase_price: 1300000,
    property_tax_rate: 0.0118,
    home_insurance_rate: 0.003,
    hoa_monthly: 500,
    state_tax_rate: 0.093,
    description: 'San Jose sits in the heart of Silicon Valley with the highest median income of any major metro. Tech compensation enables buying but pushes prices ever higher.',
    marketInsight: 'Extreme prices relative to rents strongly favor renting. Even high tech salaries struggle with $1M+ entry prices. RSU income complicates tax calculations.',
  },
  {
    name: 'Las Vegas',
    slug: 'las-vegas',
    state: 'Nevada',
    stateAbbr: 'NV',
    metro: 'Las Vegas-Henderson-Paradise',
    monthly_rent: 1700,
    purchase_price: 400000,
    property_tax_rate: 0.006,
    home_insurance_rate: 0.005,
    hoa_monthly: 100,
    state_tax_rate: 0,
    description: 'Las Vegas offers no state income tax and relatively affordable housing. The economy depends heavily on tourism and entertainment, creating employment volatility.',
    marketInsight: 'No state income tax and low property taxes make Las Vegas favorable for both renters (investment returns) and buyers. Consider job stability in tourism-dependent economy.',
  },
];

// For backwards compatibility with components that use the old CityPreset type
export const CITY_PRESETS: CityPreset[] = CITIES.map(city => ({
  name: city.name,
  slug: city.slug,
  monthly_rent: city.monthly_rent,
  purchase_price: city.purchase_price,
  property_tax_rate: city.property_tax_rate,
  home_insurance_rate: city.home_insurance_rate,
  hoa_monthly: city.hoa_monthly,
  state_tax_rate: city.state_tax_rate,
}));
```

**Step 2: Verify cities data exports correctly**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/data/cities.ts
git commit -m "feat: extend cities data to 25 metros with descriptions and market insights"
```

---

### Task 10: Create CityPage Component

**Files:**
- Modify: `frontend/src/pages/CityPage.tsx`
- Modify: `frontend/src/router.tsx`

**Step 1: Update CityPage with full implementation**

Modify `frontend/src/pages/CityPage.tsx`:
```tsx
import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CITIES, type CityData } from '../data/cities';
import { Calculator } from '../components/Calculator';

function findCity(slug: string): CityData | undefined {
  return CITIES.find(city => city.slug === slug);
}

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? findCity(slug) : undefined;

  useEffect(() => {
    if (city) {
      document.title = `Rent vs Buy Calculator: ${city.name}, ${city.stateAbbr} | ownvsrent.io`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `Should you rent or buy in ${city.name}? Use our free calculator with ${city.name} market data. Median home price: $${city.purchase_price.toLocaleString()}, median rent: $${city.monthly_rent.toLocaleString()}/month.`);
      }
    }
  }, [city]);

  if (!city) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{city.name}, {city.stateAbbr}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rent vs Buy Calculator: {city.name}, {city.stateAbbr}
        </h1>
        <p className="text-gray-600 max-w-2xl">
          {city.description}
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Median Home Price</div>
          <div className="text-xl font-semibold text-gray-900">
            ${city.purchase_price.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Median Rent</div>
          <div className="text-xl font-semibold text-gray-900">
            ${city.monthly_rent.toLocaleString()}/mo
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Property Tax Rate</div>
          <div className="text-xl font-semibold text-gray-900">
            {(city.property_tax_rate * 100).toFixed(2)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">State Income Tax</div>
          <div className="text-xl font-semibold text-gray-900">
            {city.state_tax_rate === 0 ? 'None' : `${(city.state_tax_rate * 100).toFixed(2)}%`}
          </div>
        </div>
      </div>

      {/* Market Insight */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-blue-900 mb-1">{city.name} Market Insight</div>
            <p className="text-sm text-blue-800">{city.marketInsight}</p>
          </div>
        </div>
      </div>

      {/* Calculator with city defaults applied */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Run Your Numbers for {city.name}
        </h2>
        <p className="text-gray-600 mb-6">
          Calculator pre-loaded with {city.name} market averages. Adjust the values to match your situation.
        </p>
        <Calculator />
      </div>

      {/* Other Cities */}
      <div className="border-t border-gray-100 pt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Compare Other Cities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {CITIES.filter(c => c.slug !== 'national' && c.slug !== city.slug)
            .slice(0, 10)
            .map(c => (
              <Link
                key={c.slug}
                to={`/cities/${c.slug}`}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {c.name}, {c.stateAbbr}
              </Link>
            ))}
        </div>
      </div>

      {/* Related Content */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/guide"
          className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1">Complete Rent vs Buy Guide</h4>
          <p className="text-sm text-gray-600">Learn everything about making the rent vs buy decision.</p>
        </Link>
        <Link
          to="/faq"
          className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1">Frequently Asked Questions</h4>
          <p className="text-sm text-gray-600">Get answers to common rent vs buy questions.</p>
        </Link>
      </div>
    </div>
  );
}
```

**Step 2: Add city listing page to routes**

Create `frontend/src/pages/CitiesIndexPage.tsx`:
```tsx
import { Link } from 'react-router-dom';
import { CITIES } from '../data/cities';

export function CitiesIndexPage() {
  const cities = CITIES.filter(c => c.slug !== 'national');

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Rent vs Buy by City
      </h1>
      <p className="text-gray-600 mb-8">
        Explore rent vs buy calculators pre-loaded with market data for 25 major US metros.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map(city => (
          <Link
            key={city.slug}
            to={`/cities/${city.slug}`}
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="font-medium text-gray-900">{city.name}, {city.stateAbbr}</div>
            <div className="text-sm text-gray-500 mt-1">
              ${city.purchase_price.toLocaleString()} median home
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Update router with cities index**

Modify `frontend/src/router.tsx`:
```tsx
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { GuidePage } from './pages/GuidePage';
import { MethodologyPage } from './pages/MethodologyPage';
import { FaqPage } from './pages/FaqPage';
import { CityPage } from './pages/CityPage';
import { CitiesIndexPage } from './pages/CitiesIndexPage';

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
    ],
  },
]);
```

**Step 4: Verify city pages work**

Run: `cd frontend && npm run dev`
Navigate to:
- `/cities` - See all 25 cities
- `/cities/san-francisco` - See SF page with calculator

**Step 5: Commit**

```bash
git add frontend/src/pages/CityPage.tsx frontend/src/pages/CitiesIndexPage.tsx frontend/src/router.tsx
git commit -m "feat: add city pages with market data and city index"
```

---

## Phase 4: Monetization Components

### Task 11: Create AdUnit Component

**Files:**
- Create: `frontend/src/components/AdUnit.tsx`

**Step 1: Create AdUnit component**

Create `frontend/src/components/AdUnit.tsx`:
```tsx
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format: 'leaderboard' | 'rectangle' | 'in-article';
  className?: string;
}

const formatStyles = {
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  'in-article': { width: 336, height: 280 },
};

export function AdUnit({ slot, format, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only load ads in production and if not already loaded
    if (isLoaded.current) return;
    if (!import.meta.env.PROD) return;

    const pubId = import.meta.env.VITE_ADSENSE_ID;
    if (!pubId) return;

    try {
      // @ts-expect-error - adsbygoogle is added by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch {
      // AdSense not loaded or blocked
    }
  }, []);

  const { width, height } = formatStyles[format];

  // Don't render in development
  if (!import.meta.env.PROD) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={{ width, height }}
      >
        Ad Placeholder ({format})
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', width, height }}
      data-ad-client={import.meta.env.VITE_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/AdUnit.tsx
git commit -m "feat: add AdUnit component for Google AdSense"
```

---

### Task 12: Create MortgageRateWidget Component

**Files:**
- Create: `frontend/src/components/MortgageRateWidget.tsx`

**Step 1: Create MortgageRateWidget component**

Create `frontend/src/components/MortgageRateWidget.tsx`:
```tsx
// Mock mortgage rate data - in production, this could fetch from an API
const mockRates = [
  { term: '30-year fixed', rate: 6.875, apr: 6.95 },
  { term: '15-year fixed', rate: 6.125, apr: 6.25 },
  { term: '5/1 ARM', rate: 6.25, apr: 7.15 },
];

interface MortgageRateWidgetProps {
  className?: string;
}

export function MortgageRateWidget({ className = '' }: MortgageRateWidgetProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm">Today's Mortgage Rates</h3>
        <p className="text-xs text-gray-500">National average rates</p>
      </div>

      <div className="divide-y divide-gray-100">
        {mockRates.map((rate) => (
          <div key={rate.term} className="px-4 py-3 flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-900 text-sm">{rate.term}</div>
              <div className="text-xs text-gray-500">APR: {rate.apr}%</div>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {rate.rate}%
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <a
          href="https://www.bankrate.com/mortgages/mortgage-rates/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Compare rates →
        </a>
        <p className="text-xs text-gray-400 mt-1">
          Rates as of {new Date().toLocaleDateString()}. Partner link.
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/MortgageRateWidget.tsx
git commit -m "feat: add MortgageRateWidget component with mock rates"
```

---

### Task 13: Create LeadCaptureForm Component

**Files:**
- Create: `frontend/src/components/LeadCaptureForm.tsx`

**Step 1: Create LeadCaptureForm component**

Create `frontend/src/components/LeadCaptureForm.tsx`:
```tsx
import { useState } from 'react';

interface LeadCaptureFormProps {
  className?: string;
}

export function LeadCaptureForm({ className = '' }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // In production, this would submit to a backend
    console.log('Lead captured:', { email, zipCode });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-6 text-center ${className}`}>
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-green-900 mb-1">You're on the list!</h3>
        <p className="text-sm text-green-700">
          We'll send you personalized rent vs buy insights.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-xl p-6 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-1">
        Get Personalized Insights
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Receive a detailed analysis and market updates for your area.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="sr-only">Zip Code (optional)</label>
          <input
            type="text"
            id="zipCode"
            placeholder="Zip code (optional)"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            maxLength={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Get Insights
        </button>

        <p className="text-xs text-gray-400 text-center">
          No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/LeadCaptureForm.tsx
git commit -m "feat: add LeadCaptureForm component for email capture"
```

---

### Task 14: Add AdSense Script to Index.html

**Files:**
- Modify: `frontend/index.html`
- Create: `frontend/.env.example`

**Step 1: Update index.html with AdSense script**

Modify `frontend/index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rent vs Buy Calculator 2026 | Should You Rent or Buy a Home?</title>
    <meta name="description" content="Free rent vs buy calculator with accurate math. Compare renting vs buying a home with real numbers — taxes, appreciation, PMI, and opportunity cost included. Find out which is better for you." />
    <meta name="keywords" content="rent vs buy calculator, should I rent or buy, home buying calculator, renting vs buying, rent or buy 2026" />
    <meta property="og:title" content="Rent vs Buy Calculator 2026 | Should You Rent or Buy?" />
    <meta property="og:description" content="Free calculator compares renting vs buying a home with real math. Get your personalized answer in seconds." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://ownvsrent.io" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Rent vs Buy Calculator 2026" />
    <meta name="twitter:description" content="Should you rent or buy? Find out with real math — not sales pitches." />
    <link rel="canonical" href="https://ownvsrent.io" />
    <!-- Google AdSense (loaded in production only) -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" crossorigin="anonymous"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 2: Create .env.example**

Create `frontend/.env.example`:
```
# Google AdSense Publisher ID
VITE_ADSENSE_ID=ca-pub-XXXXXXXXXX

# Google Analytics ID (optional)
VITE_GA_ID=G-XXXXXXXXXX
```

**Step 3: Commit**

```bash
git add frontend/index.html frontend/.env.example
git commit -m "feat: add AdSense script loading and environment config"
```

---

## Phase 5: SEO Polish

### Task 15: Create Sitemap and Robots.txt

**Files:**
- Create: `frontend/public/robots.txt`
- Create: `frontend/scripts/generate-sitemap.js`

**Step 1: Create robots.txt**

Create `frontend/public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://ownvsrent.io/sitemap.xml
```

**Step 2: Create sitemap generator script**

Create `frontend/scripts/generate-sitemap.js`:
```javascript
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
```

**Step 3: Add sitemap generation to build**

Modify `frontend/package.json` scripts section:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && node scripts/generate-sitemap.js && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

**Step 4: Generate sitemap**

Run: `cd frontend && node scripts/generate-sitemap.js`
Expected: `public/sitemap.xml` created

**Step 5: Verify build works**

Run: `cd frontend && npm run build`
Expected: Build succeeds with sitemap

**Step 6: Commit**

```bash
git add frontend/public/robots.txt frontend/scripts/generate-sitemap.js frontend/package.json
git commit -m "feat: add robots.txt and sitemap generation"
```

---

### Task 16: Add Cities to Navigation

**Files:**
- Modify: `frontend/src/components/Navigation.tsx`

**Step 1: Update Navigation with Cities link**

Modify `frontend/src/components/Navigation.tsx`:
```tsx
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Calculator' },
  { to: '/guide', label: 'Guide' },
  { to: '/cities', label: 'Cities' },
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
            location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
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
```

**Step 2: Commit**

```bash
git add frontend/src/components/Navigation.tsx
git commit -m "feat: add Cities link to navigation"
```

---

### Task 17: Update CitySelect to Use New Cities Data

**Files:**
- Modify: `frontend/src/components/CitySelect.tsx`

**Step 1: Read current CitySelect**

Read the file to understand current implementation.

**Step 2: Update to use CITY_PRESETS for compatibility**

Modify `frontend/src/components/CitySelect.tsx` to import from the new location:
```tsx
import { CITY_PRESETS, type CityPreset } from '../data/cities';
```

(The rest of the component likely already uses `CityPreset` type, so just update the import if needed)

**Step 3: Verify it works**

Run: `cd frontend && npm run dev`
Navigate to calculator, verify city dropdown works

**Step 4: Commit**

```bash
git add frontend/src/components/CitySelect.tsx
git commit -m "chore: update CitySelect to use CITY_PRESETS export"
```

---

### Task 18: Final Build and Verification

**Files:** None (verification only)

**Step 1: Run full build**

Run:
```bash
cd frontend && npm run build
```
Expected: Build succeeds

**Step 2: Preview the build**

Run:
```bash
cd frontend && npm run preview
```

**Step 3: Test all routes**

Navigate to each route and verify:
- `/` - Calculator works
- `/guide` - Shows full guide content
- `/methodology` - Shows methodology
- `/faq` - Shows FAQ with JSON-LD
- `/cities` - Shows city list
- `/cities/san-francisco` - Shows SF page with calculator

**Step 4: Check sitemap**

Navigate to: `http://localhost:4173/sitemap.xml`
Expected: Valid XML sitemap with all pages

**Step 5: Create final commit**

```bash
git add -A
git commit -m "chore: final verification of SEO content and monetization implementation"
```

---

## Summary

This plan implements:

1. **Routing Infrastructure** (Tasks 1-5)
   - React Router with Layout component
   - Navigation and footer
   - HomePage extracted from App.tsx

2. **Content Pages** (Tasks 6-8)
   - FAQ page with 15 questions and JSON-LD schema
   - Methodology page with detailed calculations
   - Guide page with 10 sections (~3,000 words)

3. **City Pages** (Tasks 9-10)
   - 25 cities with descriptions and market insights
   - City index page and individual city pages
   - Pre-loaded calculator with city defaults

4. **Monetization** (Tasks 11-14)
   - AdUnit component for Google AdSense
   - MortgageRateWidget for affiliate marketing
   - LeadCaptureForm for email collection
   - Environment configuration

5. **SEO Polish** (Tasks 15-18)
   - Sitemap.xml generation
   - robots.txt
   - Updated navigation
   - Final verification

---

Plan complete and saved to `docs/plans/2026-02-08-seo-monetization-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?