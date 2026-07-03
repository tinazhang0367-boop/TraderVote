// Shared domain types — Tradervote v2
//
// Types here are the *public* shape the frontend relies on. Server APIs
// (server/api/*) return these directly; SSR pages hydrate from them; the
// review wizard posts back ReviewInput / RatingInput.

// ───────────────────────────────────────────────────────────────
// Locales & geography
// ───────────────────────────────────────────────────────────────

export type LocaleCode =
  | 'en' | 'th' | 'vi' | 'id' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko'
  | 'de' | 'fr' | 'es' | 'it' | 'bg' | 'hr' | 'ru' | 'ar'

export type CountryCode =
  | 'TH' | 'VN' | 'ID' | 'MY' | 'SG' | 'PH' | 'KH' | 'MM'
  | 'CN' | 'TW' | 'JP' | 'KR' | 'IN' | 'AU'
  | 'GB' | 'US' | 'DE' | 'FR' | 'ES' | 'IT'
  | 'BG' | 'HR' | 'RU' | 'SA'
  // Additional regulator home countries
  | 'CY' | 'ZA' | 'VC' | 'BZ'

// ───────────────────────────────────────────────────────────────
// Trust & scoring
// ───────────────────────────────────────────────────────────────

export type TrustBand = 'excellent' | 'great' | 'average' | 'poor' | 'bad'

export type RegulatorTier = 'tier1' | 'tier2' | 'tier3' | 'offshore'

/** 4-axis rating. Withdrawal/Platform/Support/Pricing. */
export interface RatingBreakdown {
  withdrawal: number  // 1-5
  platform: number
  support: number
  pricing: number
}

export interface TrustScore {
  /** 0-5 in 0.1 steps */
  score: number
  band: TrustBand
  /** Total verified reviews that fed into the score */
  reviewCount: number
  /** When the score was last recomputed */
  computedAt: string
  /** Confidence based on sample size — drives UI "thin data" warnings */
  confidence: 'low' | 'medium' | 'high'
}

// ───────────────────────────────────────────────────────────────
// Broker
// ───────────────────────────────────────────────────────────────

export type BrokerCategory =
  | 'forex' | 'crypto' | 'stocks' | 'cfd' | 'prop-firm' | 'copy-trading' | 'multi-asset'

export type ExecutionType = 'market' | 'instant' | 'ecn' | 'stp'

export interface TradingConditions {
  spreads: {
    /** Major pair spreads in pips, averaged over a session */
    eurUsd?: number
    gbpUsd?: number
    xauUsd?: number
  }
  commissions: {
    type: 'spread-only' | 'per-lot'
    /** USD per lot side if per-lot model */
    perLot?: number
  }
  leverage: {
    max: number
    /** Per-region leverage caps — regions enforce their own limits */
    byRegion?: Partial<Record<CountryCode, number>>
  }
  execution: ExecutionType
  minLot: number
  maxLot?: number
}

export interface PaymentMethods {
  global: string[]                       // ['Visa', 'Mastercard', 'Wire', 'Skrill']
  byCountry?: Partial<Record<CountryCode, string[]>>
  /** Typical withdrawal time in business days */
  withdrawalDays?: { min: number; max: number }
}

export interface Broker {
  id: number
  slug: string
  name: string
  logoUrl: string
  regulators: string[]                   // ['FCA', 'CySEC', 'ASIC']
  founded: number
  headquarters: string

  // Money
  minDeposit: { amount: number; currency: string } | null
  maxLeverage: string                    // '1:500' — display string
  spreadsFrom: number                    // pips
  platforms: string[]                    // ['MT4', 'MT5', 'cTrader']

  // Locale support (legacy flat booleans — also covered by paymentMethods)
  thSupport?: boolean
  idrSupport?: boolean
  vndSupport?: boolean

  // Scoring
  trustScore: number
  trustBand: TrustBand
  reviewCount: number
  rank?: number

  // Categorization & SEO
  category?: BrokerCategory
  affiliateUrl?: string
  description?: string

  // ★ Phase 2 — extended trading & payments
  tradingConditions?: TradingConditions
  paymentMethods?: PaymentMethods

  // ★ B2B — claimed profile (Pro / Enterprise tiers)
  claimed?: boolean
  claimedAt?: string
  subscriptionTier?: 'free' | 'pro' | 'enterprise'

  // ★ AI summary — cached, recomputed nightly
  aiSummary?: string
  aiSummaryAt?: string
  /** Top topics extracted from reviews (sentiment + frequency) */
  topTopics?: TopicInsight[]
}

export interface TopicInsight {
  /** Normalized topic key, e.g. "withdrawal", "platform_mt5", "support" */
  key: string
  /** Display label, e.g. "Withdrawal speed" */
  label: string
  /** Sentiment polarity */
  sentiment: 'positive' | 'neutral' | 'negative'
  /** How many reviews mention this topic */
  count: number
  /** % of recent reviews that mention this topic */
  share: number
  /** Optional 1-line summary */
  summary?: string
}

// ───────────────────────────────────────────────────────────────
// Reviews
// ───────────────────────────────────────────────────────────────

export type ExperienceLevel = 'beginner' | 'intermediate' | 'pro'

export type TradedAsset = 'forex' | 'crypto' | 'stocks' | 'commodities' | 'indices' | 'cfd'

export interface Review {
  id: number
  brokerId: number
  brokerSlug: string
  authorName: string
  authorCountry: string                  // 'Thailand'
  authorCountryFlag?: string            // legacy emoji (deprecated)
  /** Country ISO alpha-2 — preferred over flag emoji */
  authorCountryCode?: CountryCode

  // ★ Phase 2 — 4-axis breakdown + traditional overall
  rating: number                        // 1-5 overall (computed average of breakdown)
  ratingBreakdown?: RatingBreakdown
  trustBand: TrustBand

  title?: string
  body: string
  translations?: Partial<Record<LocaleCode, string>>

  // ★ Phase 2 — trader context
  experienceLevel?: ExperienceLevel
  tradedAssets?: TradedAsset[]
  depositMethod?: string                // 'BCA', 'TrueMoney', 'Wire', 'Visa'
  /** Reviewer confirmed a deposit or withdrawal with a screenshot */
  verified: boolean
  verificationProof?: string           // screenshot URL

  helpful: number
  withdrawalCurrency?: string

  // ★ Phase 3 — broker reply
  brokerReply?: BrokerReply

  createdAt: string                     // ISO 8601
}

export interface BrokerReply {
  id: number
  reviewId: number
  brokerId: number
  body: string
  createdAt: string
  /** Only `official: true` replies count toward TrustScore adjustments */
  official: boolean
}

/** Wizard input — used by /write-review POST. */
export interface ReviewInput {
  brokerId: number
  authorName: string
  authorEmail: string
  authorCountry: CountryCode
  experienceLevel: ExperienceLevel
  tradedAssets: TradedAsset[]
  depositMethod?: string
  ratingBreakdown: RatingBreakdown
  body: string
  title?: string
  verificationProof?: string
  /** Honeypot for bots — must be empty */
  website?: string
}

// ───────────────────────────────────────────────────────────────
// Geography
// ───────────────────────────────────────────────────────────────

export interface Country {
  code: CountryCode
  name: string
  flag: string                          // legacy emoji (deprecated)
  brokerCount: number
  /** ISO alpha-2 for FlagIcon rendering */
  alpha2?: string
  primaryRegulator?: string             // 'SEC Thailand'
  popularPaymentMethods?: string[]
}

// ───────────────────────────────────────────────────────────────
// Regulator (Phase 2)
// ───────────────────────────────────────────────────────────────

export interface Regulator {
  code: string                          // 'FCA'
  country: CountryCode                  // 'GB'
  name: string                          // 'Financial Conduct Authority'
  shortName?: string                    // 'UK FCA'
  description: string                   // markdown
  investorProtection?: {
    amount: number
    currency: string
    description: string
  }
  verificationUrl: string               // where to look up the license
  logoUrl?: string
  tier: RegulatorTier
  brokerCount?: number                  // populated by server aggregation
}

// ───────────────────────────────────────────────────────────────
// Promotions
// ───────────────────────────────────────────────────────────────

export type PromotionType = 'welcome_bonus' | 'cashback' | 'no_deposit' | 'free_withdrawal'

export interface Promotion {
  id: number
  brokerId: number
  brokerSlug: string
  brokerName: string
  brokerLogoUrl: string
  type: PromotionType
  title: string
  amount: string
  description: string
  termsUrl: string
  affiliateUrl: string
  expiresAt?: string
  daysLeft?: number
}

// ───────────────────────────────────────────────────────────────
// BrokerCategory (Phase 2) — for /category/[slug]
// ───────────────────────────────────────────────────────────────

export interface BrokerCategoryPage {
  slug: BrokerCategory | string          // 'forex', 'prop-firm', 'crypto', or region like 'sea'
  title: string
  description: string
  icon?: string
  brokerCount: number
  topBrokers: Broker[]
}

// ───────────────────────────────────────────────────────────────
// API response envelopes
// ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}