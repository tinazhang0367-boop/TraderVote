// BFF: blog post list
export default defineEventHandler(async () => {
  return [
    { slug: 'what-is-cfd', title: 'What is a CFD?', excerpt: 'A complete guide to contracts for difference for SEA traders.', category: 'EDUCATION', readingTime: 5, locale: 'en', publishedAt: '2026-06-18', coverColor: 'linear-gradient(135deg, #0a0b0d, #1f2937)' },
    { slug: 'usd-thb-outlook-2026', title: 'USD/THB outlook 2026', excerpt: 'Bank of Thailand policy shifts and baht volatility.', category: 'MARKETS', readingTime: 8, locale: 'en', publishedAt: '2026-06-12', coverColor: 'linear-gradient(135deg, #1652f0, #7c3aed)' },
    { slug: 'exness-vs-xm-2026', title: 'Exness vs XM 2026', excerpt: 'Head-to-head on spreads, leverage, withdrawal speed and local support.', category: 'REVIEW', readingTime: 12, locale: 'vi', publishedAt: '2026-06-08', coverColor: 'linear-gradient(135deg, #00b67a, #1652f0)' },
    { slug: 'margin-leverage-explained', title: 'Margin & leverage explained', excerpt: 'How leverage amplifies both profits and losses in CFD trading.', category: 'EDUCATION', readingTime: 6, locale: 'en', publishedAt: '2026-06-01', coverColor: 'linear-gradient(135deg, #ffb400, #ff7a00)' },
    { slug: 'idr-deposit-methods', title: 'Deposit methods for Indonesian traders', excerpt: 'Bank transfers, e-wallets and crypto deposits compared.', category: 'GUIDE', readingTime: 7, locale: 'id', publishedAt: '2026-05-25', coverColor: 'linear-gradient(135deg, #d32f2f, #ff7a00)' },
    { slug: 'thai-tax-forex', title: 'Thai tax on forex trading 2026', excerpt: 'What Thai traders need to know about capital gains tax.', category: 'LEGAL', readingTime: 9, locale: 'th', publishedAt: '2026-05-18', coverColor: 'linear-gradient(135deg, #7c3aed, #1652f0)' },
  ]
})
