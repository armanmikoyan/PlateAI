import {
  PRICING_COMPARISON_ROWS,
  PRICING_PAGE,
  PRICING_TIERS,
} from './constants';

export function PricingComparisonTable() {
  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="pricing-comparison-heading"
          className="text-content text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {PRICING_PAGE.COMPARISON_HEADING}
        </h2>
        <p className="text-content-muted mt-2 text-sm/relaxed sm:text-base">
          {PRICING_PAGE.COMPARISON_CAPTION}
        </p>
      </div>

      <div className="border-edge mt-8 overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">{PRICING_PAGE.COMPARISON_HEADING}</caption>
          <thead>
            <tr className="border-edge bg-surface-overlay/40 border-b">
              <th scope="col" className="text-content-muted px-4 py-3 font-medium sm:px-6">
                Feature
              </th>
              {PRICING_TIERS.map((tier) => (
                <th
                  key={tier.ID}
                  scope="col"
                  className="text-content px-4 py-3 font-semibold sm:px-6"
                >
                  {tier.NAME}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRICING_COMPARISON_ROWS.map((row) => (
              <tr key={row.KEY} className="border-edge/80 border-b last:border-b-0">
                <th scope="row" className="text-content-muted px-4 py-3 font-medium sm:px-6">
                  {row.LABEL}
                </th>
                {PRICING_TIERS.map((tier) => (
                  <td key={`${tier.ID}-${row.KEY}`} className="text-content px-4 py-3 sm:px-6">
                    {tier.COMPARISON[row.KEY]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
