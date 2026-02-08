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
