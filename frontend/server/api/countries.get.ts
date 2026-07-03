// BFF: countries with broker counts
import type { Country } from '~/types/broker'

export default defineEventHandler(async (): Promise<Country[]> => {
  if (process.env.NODE_ENV !== 'production') {
    return mockCountries
  }
  // Production: proxy to legacy
  const config = useRuntimeConfig()
  try {
    return await $fetch<Country[]>(`${config.backendBaseUrl}/index.php?s=api/brokers/country`)
  } catch {
    return mockCountries
  }
})

const mockCountries: Country[] = [
  { code: 'TH', name: 'Thailand',        flag: '🇹🇭', brokerCount: 42 },
  { code: 'VN', name: 'Vietnam',         flag: '🇻🇳', brokerCount: 38 },
  { code: 'ID', name: 'Indonesia',       flag: '🇮🇩', brokerCount: 35 },
  { code: 'MY', name: 'Malaysia',        flag: '🇲🇾', brokerCount: 28 },
  { code: 'SG', name: 'Singapore',       flag: '🇸🇬', brokerCount: 22 },
  { code: 'PH', name: 'Philippines',     flag: '🇵🇭', brokerCount: 19 },
  { code: 'KH', name: 'Cambodia',        flag: '🇰🇭', brokerCount: 8  },
  { code: 'MM', name: 'Myanmar',         flag: '🇲🇲', brokerCount: 6  },
]
