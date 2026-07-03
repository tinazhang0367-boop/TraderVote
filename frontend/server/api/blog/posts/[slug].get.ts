// BFF: single blog post
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const posts: Record<string, any> = {
    'what-is-cfd': {
      slug: 'what-is-cfd', title: 'What is a CFD? A complete guide for SEA traders',
      excerpt: 'Contracts for Difference explained — how they work and the risks.',
      category: 'EDUCATION', readingTime: 5, publishedAt: '2026-06-18', coverColor: 'linear-gradient(135deg, #0a0b0d, #1f2937)',
      author: 'David Chen',
      html: `
        <h2>1. What is a CFD?</h2>
        <p>A Contract for Difference (CFD) is a financial derivative that lets you speculate on price movements without owning the underlying asset.</p>
        <p>When you trade a CFD, you agree to exchange the difference in an asset's price between when you open and close the position.</p>
        <p><strong>Example:</strong> EUR/USD at 1.0850 — You buy 1 standard lot (100,000) with $1,000 margin (1:100 leverage). If price moves to 1.0870, you profit $200. If it moves to 1.0830, you lose $200.</p>
        <h2>2. How CFDs work in SEA markets</h2>
        <p>Retail forex and CFD trading has grown rapidly across Southeast Asia. Brokers targeting Thai, Vietnamese and Indonesian traders typically offer local currency deposit methods, 24/7 chat support in the local language, and bonuses to attract new accounts.</p>
        <h2>3. Key risks</h2>
        <p>CFDs are leveraged products. Most retail traders lose money — be cautious and never trade money you cannot afford to lose.</p>
      `,
    },
    'usd-thb-outlook-2026': {
      slug: 'usd-thb-outlook-2026', title: 'USD/THB outlook 2026', excerpt: 'Bank of Thailand policy shifts.', category: 'MARKETS', readingTime: 8, publishedAt: '2026-06-12', coverColor: 'linear-gradient(135deg, #1652f0, #7c3aed)', author: 'Anan P.',
      html: '<h2>Q3 2026 outlook</h2><p>The baht has weakened against the dollar as the BOT held rates steady while the Fed signaled fewer cuts.</p>',
    },
  }
  return posts[slug!] ?? null
})
