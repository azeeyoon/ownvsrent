# SEO Content & Monetization Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add SEO content pages and monetization to ownvsrent.io to increase organic traffic and generate revenue.

**Architecture:** React Router with pre-rendering for multi-page SEO, AdSense + affiliate widgets for monetization.

**Tech Stack:** React Router, @prerenderer/rollup-plugin, Google AdSense, affiliate APIs (LendingTree/Bankrate).

---

## 1. Architecture & Routing

### Directory Structure
```
frontend/src/
├── pages/
│   ├── HomePage.tsx          # Current calculator (move from App.tsx)
│   ├── GuidePage.tsx         # /guide - 3000+ word guide
│   ├── MethodologyPage.tsx   # /methodology - how calculator works
│   ├── FaqPage.tsx           # /faq - 15+ questions with JSON-LD
│   └── CityPage.tsx          # /cities/:slug - city-specific pages
├── content/
│   ├── guide-sections/       # Guide content chunks
│   ├── faq-data.ts           # FAQ questions and answers
│   └── methodology-content.ts # Methodology text content
├── components/
│   ├── Layout.tsx            # Shared header/footer/nav
│   ├── AdUnit.tsx            # AdSense wrapper
│   ├── MortgageRateWidget.tsx # Affiliate widget
│   └── LeadCaptureForm.tsx   # Email capture
└── data/
    └── cities.ts             # Extended with 25 cities
```

### Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Calculator (current functionality) |
| `/guide` | GuidePage | Comprehensive rent vs buy guide |
| `/methodology` | MethodologyPage | How the calculator works |
| `/faq` | FaqPage | FAQ with JSON-LD schema |
| `/cities/:slug` | CityPage | City-specific pages (25 cities) |

### Pre-rendering Strategy
- Use `@prerenderer/rollup-plugin` for static HTML generation
- Pre-render all routes at build time
- Output to `dist/` for Cloudflare Pages deployment
- Sitemap.xml generated automatically

---

## 2. Monetization Components

### AdSense Placements
```tsx
// AdUnit.tsx
interface AdUnitProps {
  slot: string;
  format: 'leaderboard' | 'rectangle' | 'in-article';
  className?: string;
}
```

**Placement locations:**
1. **Header leaderboard** (728x90) - Below nav, above content
2. **Sidebar rectangle** (300x250) - Sticky on desktop, in-content on mobile
3. **In-article** - Between major sections on content pages
4. **Footer leaderboard** - Above footer

**Rules:**
- Never inside calculator interaction area
- Max 3 ads per page
- Lazy-load below-fold ads

### Affiliate Widget
```tsx
// MortgageRateWidget.tsx
// Shows current mortgage rates with affiliate links
// Data: Mock rates initially, can integrate LendingTree API later
// Placement: Sidebar on calculator, in-content on guide
```

### Lead Capture
```tsx
// LeadCaptureForm.tsx
// "Get personalized results via email"
// Fields: email, zip code (optional)
// Triggers: After calculation, on guide page
```

---

## 3. Guide Page Structure

**Route:** `/guide`
**Target:** 3,000+ words
**Title:** "Rent vs Buy in 2026: The Complete Guide"

### Sections (10 total)

1. **Introduction** (~200 words)
   - The biggest financial decision of your life
   - Why most advice is biased

2. **The 5% Rule Explained** (~300 words)
   - Quick mental math for rent vs buy
   - When it works, when it doesn't

3. **True Cost of Homeownership** (~400 words)
   - PITI breakdown
   - Hidden costs: maintenance, HOA, repairs
   - Opportunity cost of down payment

4. **True Cost of Renting** (~300 words)
   - Rent + insurance
   - What renters can invest instead
   - Flexibility value

5. **The Tax Benefit Reality** (~400 words)
   - Standard vs itemized deduction
   - Why most buyers don't benefit from mortgage interest deduction
   - SALT cap impact (2025 OBBBA changes)

6. **Market Conditions Matter** (~300 words)
   - Appreciation assumptions
   - Interest rate environment
   - Local market dynamics

7. **How Long You'll Stay** (~250 words)
   - Breakeven analysis
   - Transaction costs kill short holds
   - The 5-7 year rule

8. **Lifestyle Factors** (~250 words)
   - Job flexibility
   - Family planning
   - Risk tolerance

9. **Common Mistakes** (~300 words)
   - Comparing rent to mortgage payment only
   - Ignoring opportunity cost
   - Overestimating appreciation
   - Underestimating maintenance

10. **Using Our Calculator** (~300 words)
    - How to input your numbers
    - Interpreting results
    - CTA to calculator

---

## 4. FAQ Page Structure

**Route:** `/faq`
**Target:** 15+ questions, 2,000+ words total

### JSON-LD Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is it better to rent or buy in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

### Questions (15)
1. Is it better to rent or buy in 2026?
2. How much should I spend on a house?
3. What is the 5% rule for renting vs buying?
4. How much do I need for a down payment?
5. Is renting really throwing money away?
6. How long should I plan to stay to make buying worth it?
7. What's the true cost of homeownership?
8. Do I really save money on taxes by owning a home?
9. What happens to PMI when I hit 20% equity?
10. How does appreciation affect the rent vs buy decision?
11. Should I buy if I can afford the mortgage payment?
12. What opportunity cost am I missing by buying?
13. How do interest rates affect rent vs buy?
14. Is it better to buy a condo or rent an apartment?
15. What about building equity vs investing in stocks?

---

## 5. Methodology Page Structure

**Route:** `/methodology`
**Target:** 1,500+ words
**Title:** "How Our Rent vs Buy Calculator Works"

### Sections
1. **Overview** (~200 words)
   - Month-by-month simulation
   - Why accuracy matters

2. **Renting Calculations** (~250 words)
   - Rent escalation
   - Investment portfolio growth
   - Formulas with examples

3. **Buying Calculations** (~400 words)
   - Amortization schedule
   - PITI breakdown
   - PMI removal logic
   - Home appreciation

4. **Tax Calculations** (~300 words)
   - Standard vs itemized comparison
   - SALT cap rules (2025-2029, 2030+)
   - Mortgage interest deduction cap
   - PMI deductibility (2026+)

5. **Wealth Comparison** (~200 words)
   - Net wealth at horizon
   - Selling costs
   - Capital gains exemption

6. **Our Sources** (~150 words)
   - IRS publications
   - Tax law citations
   - Link to source code (transparency)

---

## 6. City Pages Structure

**Route:** `/cities/:slug`
**Template:** Dynamic component with city-specific data

### City Data Structure
```typescript
interface CityData {
  slug: string;           // "san-francisco"
  name: string;           // "San Francisco"
  state: string;          // "California"
  stateAbbr: string;      // "CA"
  metro: string;          // "San Francisco-Oakland-Berkeley"

  // Pre-loaded defaults
  monthly_rent: number;
  purchase_price: number;
  property_tax_rate: number;
  home_insurance_rate: number;
  hoa_monthly: number;
  state_tax_rate: number;

  // Content
  description: string;    // 150-200 word city intro
  marketInsight: string;  // Current market conditions
  verdict: string;        // "rent" | "buy" | "close"
}
```

### 25 Cities
1. San Francisco, CA
2. New York, NY
3. Los Angeles, CA
4. Seattle, WA
5. Boston, MA
6. Austin, TX
7. Denver, CO
8. Miami, FL
9. Chicago, IL
10. Washington, DC
11. San Diego, CA
12. Portland, OR
13. Phoenix, AZ
14. Dallas, TX
15. Atlanta, GA
16. Houston, TX
17. Philadelphia, PA
18. Minneapolis, MN
19. Nashville, TN
20. Raleigh, NC
21. Salt Lake City, UT
22. Charlotte, NC
23. Tampa, FL
24. San Jose, CA
25. Las Vegas, NV

### Page Structure
- H1: "Rent vs Buy Calculator: {City}, {State}"
- City description (150-200 words)
- Calculator pre-loaded with city defaults
- Market insight section
- CTA to general guide

---

## 7. Implementation Summary

### Phase 1: Infrastructure
- Add React Router
- Create Layout component with nav
- Set up pre-rendering

### Phase 2: Content Pages
- Guide page with all 10 sections
- FAQ page with JSON-LD schema
- Methodology page

### Phase 3: City Pages
- Extend cities.ts with 25 cities
- Create CityPage template
- Generate all city routes

### Phase 4: Monetization
- AdUnit component
- MortgageRateWidget (mock data)
- LeadCaptureForm
- AdSense integration

### Phase 5: SEO Polish
- Sitemap.xml generation
- robots.txt
- Meta tags on all pages
- Internal linking strategy
