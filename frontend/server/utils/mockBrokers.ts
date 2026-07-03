// Mock broker data — single source of truth for dev mode.
// In production, BFF endpoints proxy to legacy ThinkPHP backend instead.
//
// Refactor: extracted from `server/api/brokers/top.get.ts` so multiple endpoints
// (top / all / detail) can share data without circular file-to-file imports.
import type { Broker } from '../../types/broker'

export const mockTopBrokers: Broker[] = [
  { id: 1, slug: 'exness', name: 'Exness', logoUrl: '', regulators: ['CySEC','FCA','FSA','CMA'], founded: 2008, headquarters: 'Limassol, Cyprus', minDeposit: { amount: 1, currency: 'USD' }, maxLeverage: '1:Unlimited', spreadsFrom: 0.3, platforms: ['MT4','MT5','Exness Terminal'], thSupport: true, idrSupport: true, vndSupport: true, trustScore: 4.8, trustBand: 'excellent', reviewCount: 2341, rank: 1, affiliateUrl: 'https://www.exness.com/?pa=TV' },
  { id: 2, slug: 'xm', name: 'XM Group', logoUrl: '', regulators: ['CySEC','ASIC','IFSC'], founded: 2009, headquarters: 'Limassol, Cyprus', minDeposit: { amount: 5, currency: 'USD' }, maxLeverage: '1:888', spreadsFrom: 0.6, platforms: ['MT4','MT5'], thSupport: true, idrSupport: true, vndSupport: true, trustScore: 4.4, trustBand: 'great', reviewCount: 1892, rank: 2, affiliateUrl: 'https://www.xm.com/?pa=TV' },
  { id: 3, slug: 'fxgt', name: 'FXGT.com', logoUrl: '', regulators: ['CySEC','FSA'], founded: 2019, headquarters: 'Cyprus', minDeposit: { amount: 5, currency: 'USD' }, maxLeverage: '1:500', spreadsFrom: 0.8, platforms: ['MT4','MT5'], thSupport: false, idrSupport: true, vndSupport: true, trustScore: 4.2, trustBand: 'great', reviewCount: 1204, rank: 3, affiliateUrl: 'https://fxgt.com/?pa=TV' },
  { id: 4, slug: 'icmarkets', name: 'IC Markets', logoUrl: '', regulators: ['ASIC','CySEC','FSA'], founded: 2007, headquarters: 'Sydney, Australia', minDeposit: { amount: 200, currency: 'USD' }, maxLeverage: '1:500', spreadsFrom: 0.0, platforms: ['MT4','MT5','cTrader'], thSupport: false, idrSupport: false, vndSupport: false, trustScore: 4.1, trustBand: 'great', reviewCount: 986, rank: 4 },
  { id: 5, slug: 'pepperstone', name: 'Pepperstone', logoUrl: '', regulators: ['ASIC','FCA','DFSA'], founded: 2010, headquarters: 'Melbourne, Australia', minDeposit: { amount: 200, currency: 'USD' }, maxLeverage: '1:500', spreadsFrom: 0.0, platforms: ['MT4','MT5','cTrader','TradingView'], thSupport: false, idrSupport: false, vndSupport: false, trustScore: 3.9, trustBand: 'average', reviewCount: 742, rank: 5 },
]
