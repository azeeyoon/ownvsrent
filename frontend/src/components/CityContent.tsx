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
  const isAffordableMarket = city.purchase_price < 400000;

  // Determine market type based on state
  const isFloridaMarket = city.stateAbbr === 'FL';
  const isCaliforniaMarket = city.stateAbbr === 'CA';
  const isTexasMarket = city.stateAbbr === 'TX';

  return (
    <div className="space-y-8 mt-12 border-t border-gray-100 pt-10">
      {/* Renting Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Renting in {city.name}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
          <p>
            The median rent in {city.name} is <strong>${city.monthly_rent.toLocaleString()}/month</strong>.
            {hasNoIncomeTax
              ? ` With no state income tax in ${city.state}, renters who invest their savings see higher after-tax returns compared to high-tax states. This makes the "invest the difference" strategy particularly effective here.`
              : ` ${city.state}'s ${(city.state_tax_rate * 100).toFixed(1)}% state income tax affects investment returns for renters, reducing the advantage of the "invest the difference" strategy compared to no-tax states.`
            }
          </p>
          <p>
            Renter's insurance in {city.name} typically costs $15-30/month, significantly less than homeowner's insurance at approximately ${insuranceMonthly.toLocaleString()}/month for a median-priced home.
            {isFloridaMarket && " Florida's insurance market has seen significant rate increases due to hurricane risk, making this cost differential even more notable."}
            {isCaliforniaMarket && " California homeowners also face potential wildfire risk premiums depending on location."}
          </p>
        </div>
      </section>

      {/* Buying Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Buying in {city.name}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
          <p>
            The median home price in {city.name} is <strong>${city.purchase_price.toLocaleString()}</strong>.
            Property taxes average {(city.property_tax_rate * 100).toFixed(2)}%, adding approximately <strong>${propertyTaxMonthly.toLocaleString()}/month</strong> to ownership costs.
            {hasHighPropertyTax && " This is significantly above the national average of 1.1%, which is a key factor in the rent vs buy calculation."}
            {isTexasMarket && " Texas relies heavily on property taxes in lieu of state income tax, so while you save on income tax, property tax costs are substantial."}
            {isCaliforniaMarket && " California's Proposition 13 limits property tax increases to 2% annually, which benefits long-term homeowners."}
          </p>
          <p>
            Homeowner's insurance runs about ${insuranceMonthly.toLocaleString()}/month for a median-priced home.
            {hasHighInsurance && ` ${city.state} has elevated insurance costs due to natural disaster risk factors, adding to the true cost of ownership.`}
            {city.hoa_monthly > 0 && ` Many properties in ${city.name} also have HOA fees, averaging around $${city.hoa_monthly}/month, which cover amenities and common area maintenance.`}
            {city.hoa_monthly === 0 && ` ${city.name} has relatively few HOA communities compared to other metros, meaning fewer recurring fees for many homeowners.`}
          </p>
        </div>
      </section>

      {/* Key Factors Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Key Factors for {city.name}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
          <p>
            The price-to-rent ratio in {city.name} is approximately <strong>{priceToRent}x</strong> annual rent.
            {priceToRent >= 20
              ? " Ratios above 20 generally favor renting, as the cost of ownership significantly outpaces rental costs. In this market, you'd need to stay many years before buying becomes advantageous."
              : priceToRent >= 15
              ? " Ratios between 15-20 suggest the decision depends heavily on your specific situation, expected holding period, and personal preferences."
              : " Ratios below 15 typically favor buying, as ownership costs are relatively low compared to renting. The break-even point often comes sooner in these markets."
            }
          </p>
          <p>
            {isExpensiveMarket
              ? `In a high-cost market like ${city.name}, the large down payment required represents significant opportunity cost. A 20% down payment of $${(city.purchase_price * 0.2).toLocaleString()} could generate substantial returns if invested in the stock market instead. This is why our calculator factors in investment opportunity cost.`
              : isAffordableMarket
              ? `${city.name}'s relatively affordable home prices mean a smaller down payment and lower opportunity cost. A 20% down payment of $${(city.purchase_price * 0.2).toLocaleString()} is more attainable for many buyers, and the break-even timeline tends to be shorter.`
              : `${city.name} sits in the middle range of affordability among major metros. A 20% down payment of $${(city.purchase_price * 0.2).toLocaleString()} represents a significant but not extreme opportunity cost.`
            }
          </p>
          {hasNoIncomeTax && (
            <p>
              {city.state}'s lack of state income tax benefits both renters and buyers, though the effect differs. Renters keep more of their investment gains (no state tax on capital gains or dividends), while buyers have more take-home pay for mortgage payments.
              {isTexasMarket && " However, Texas compensates with higher property taxes, so homeowners don't fully escape state-level taxation."}
              {isFloridaMarket && " Combined with Florida's homestead exemption for primary residences, this creates a relatively favorable environment for homeownership."}
            </p>
          )}
        </div>
      </section>

      {/* Bottom Line Section */}
      <section className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          The Bottom Line for {city.name}
        </h2>
        <p className="text-gray-600">
          {priceToRent >= 20
            ? `With a price-to-rent ratio of ${priceToRent}x, ${city.name} tends to favor renting for shorter holding periods. Use the calculator above with your specific numbers to find your personal break-even point.`
            : priceToRent >= 15
            ? `${city.name}'s balanced market means the rent vs buy decision comes down to your individual circumstances. Input your actual numbers in the calculator above to see which option works better for your timeline.`
            : `${city.name}'s favorable price-to-rent ratio of ${priceToRent}x often makes buying attractive, especially for longer holding periods. Run your numbers through the calculator to see your specific break-even timeline.`
          }
        </p>
      </section>
    </div>
  );
}
