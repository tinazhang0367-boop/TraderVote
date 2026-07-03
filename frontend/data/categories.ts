import type { BrokerCategory } from '~/types/broker'

/**
 * Broker categories surfaced via /category/[slug]. Each entry describes the
 * category's purpose so the page hero can explain why it exists.
 */
export interface CategoryDef {
  slug: BrokerCategory | string
  title: string
  shortTitle: string
  description: string
  icon: string                // emoji or inline svg key
  color: string               // theme accent
  keywords: string[]
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: 'forex',
    title: 'Forex Brokers',
    shortTitle: 'Forex',
    description:
      'Brokers specializing in foreign exchange trading. Compare spreads, leverage, and execution quality across 100+ currency pairs.',
    icon: '💱',
    color: '#1652f0',
    keywords: ['forex', 'currency', 'FX', 'pairs', 'majors', 'minors'],
  },
  {
    slug: 'crypto',
    title: 'Crypto Brokers',
    shortTitle: 'Crypto',
    description:
      'Trade Bitcoin, Ethereum and altcoins against fiat. Spot, margin and derivatives on regulated venues.',
    icon: '₿',
    color: '#f7931a',
    keywords: ['crypto', 'bitcoin', 'ethereum', 'BTC', 'ETH', 'altcoin'],
  },
  {
    slug: 'prop-firm',
    title: 'Prop Firms',
    shortTitle: 'Prop Firm',
    description:
      'Proprietary trading firms offering funded accounts. Pass an evaluation, trade with firm capital, keep up to 90% of profits.',
    icon: '🏦',
    color: '#00b67a',
    keywords: ['prop firm', 'funded', 'challenge', 'evaluation', 'FTMO', 'funded trader'],
  },
  {
    slug: 'cfd',
    title: 'CFD Brokers',
    shortTitle: 'CFD',
    description:
      'Trade Contracts for Difference on indices, commodities, shares and bonds with leverage and short-selling capability.',
    icon: '📊',
    color: '#9c27b0',
    keywords: ['CFD', 'contracts for difference', 'indices', 'commodities'],
  },
  {
    slug: 'copy-trading',
    title: 'Copy Trading Platforms',
    shortTitle: 'Copy Trade',
    description:
      'Automatically mirror the trades of experienced traders. Built-in strategy marketplaces and risk controls.',
    icon: '🔁',
    color: '#ff9800',
    keywords: ['copy trading', 'mirror', 'social trading', 'strategy'],
  },
  {
    slug: 'stocks',
    title: 'Stock Brokers',
    shortTitle: 'Stocks',
    description:
      'Trade shares and ETFs on regulated exchanges. Compare commissions, fractional shares, and dividend handling.',
    icon: '📈',
    color: '#2196f3',
    keywords: ['stocks', 'shares', 'equities', 'ETFs', 'NYSE', 'NASDAQ'],
  },
  {
    slug: 'multi-asset',
    title: 'Multi-Asset Brokers',
    shortTitle: 'Multi-Asset',
    description:
      'One account, many asset classes. Forex, stocks, crypto, commodities, indices — all from a single platform.',
    icon: '🌐',
    color: '#607d8b',
    keywords: ['multi-asset', 'one account', 'all-in-one'],
  },
  {
    slug: 'sea',
    title: 'Best Brokers in Southeast Asia',
    shortTitle: 'SEA Brokers',
    description:
      'Brokers popular with Thai, Vietnamese, Indonesian, and Malaysian traders. Local payment methods and SEA-language support.',
    icon: '🌏',
    color: '#e91e63',
    keywords: ['Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'SEA', 'local payment'],
  },
]

export const CATEGORIES_BY_SLUG = Object.fromEntries(
  CATEGORIES.map(c => [c.slug, c]),
) as Record<string, CategoryDef>