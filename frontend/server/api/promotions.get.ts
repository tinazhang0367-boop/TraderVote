// BFF: active promotions
import type { Promotion } from '~/types/broker'

export default defineEventHandler(async (): Promise<Promotion[]> => {
  if (process.env.NODE_ENV !== 'production') return mockPromotions

  const config = useRuntimeConfig()
  try {
    return await $fetch<Promotion[]>(`${config.backendBaseUrl}/index.php?s=api/promotions/active`)
  } catch {
    return mockPromotions
  }
})

const mockPromotions: Promotion[] = [
  { id: 1, brokerId: 1, brokerSlug: 'exness', brokerName: 'Exness', brokerLogoUrl: '', type: 'welcome_bonus', title: 'Welcome bonus up to $1,500', amount: '$1,500', description: 'Min deposit $100 · Trade volume required', termsUrl: '#', affiliateUrl: 'https://www.exness.com/?pa=TV', daysLeft: 3 },
  { id: 2, brokerId: 2, brokerSlug: 'xm', brokerName: 'XM Group', brokerLogoUrl: '', type: 'welcome_bonus', title: '100% deposit match up to $500', amount: '$500', description: 'Min deposit $5 · Bonus credited instantly', termsUrl: '#', affiliateUrl: 'https://www.xm.com/?pa=TV', daysLeft: 7 },
  { id: 3, brokerId: 3, brokerSlug: 'fxgt', brokerName: 'FXGT.com', brokerLogoUrl: '', type: 'cashback', title: 'Cashback on every trade', amount: '$5/lot', description: 'No volume requirements · Crypto pairs 80+', termsUrl: '#', affiliateUrl: 'https://fxgt.com/?pa=TV', daysLeft: 12 },
  { id: 4, brokerId: 4, brokerSlug: 'icmarkets', brokerName: 'IC Markets', brokerLogoUrl: '', type: 'no_deposit', title: 'No deposit bonus up to $30', amount: '$30', description: 'No deposit required · Trade & win', termsUrl: '#', affiliateUrl: '#' },
  { id: 5, brokerId: 5, brokerSlug: 'pepperstone', brokerName: 'Pepperstone', brokerLogoUrl: '', type: 'free_withdrawal', title: 'Zero withdrawal fees', amount: '$0 fees', description: 'Razor account · ECN spreads from 0.0', termsUrl: '#', affiliateUrl: '#' },
]
