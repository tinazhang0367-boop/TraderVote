import type { CountryCode, Regulator } from '~/types/broker'

/**
 * Hard-coded regulator profiles. In production this would live in a CMS or
 * database so analysts can keep descriptions / protection limits current
 * without redeploying. Kept here so the UI ships with realistic data.
 */
export const REGULATORS: Regulator[] = [
  {
    code: 'FCA',
    country: 'GB' as CountryCode,
    name: 'Financial Conduct Authority',
    shortName: 'UK FCA',
    description:
      'The FCA is the conduct regulator for financial services firms and financial markets in the United Kingdom. It supervises more than 50,000 firms and is one of the most-respected regulators in retail trading.',
    investorProtection: {
      amount: 85000,
      currency: 'GBP',
      description: 'Up to £85,000 per eligible claimant via the Financial Services Compensation Scheme (FSCS).',
    },
    verificationUrl: 'https://register.fca.org.uk/',
    tier: 'tier1',
  },
  {
    code: 'ASIC',
    country: 'AU' as CountryCode,
    name: 'Australian Securities and Investments Commission',
    shortName: 'ASIC',
    description:
      'ASIC is Australia\'s integrated corporate, markets, financial services and consumer credit regulator. Australian regulation requires client money to be kept in segregated trust accounts at AA-rated banks.',
    investorProtection: {
      amount: 0,
      currency: 'AUD',
      description: 'No statutory compensation scheme; client money must be segregated from company funds.',
    },
    verificationUrl: 'https://connectonline.asic.gov.au/',
    tier: 'tier1',
  },
  {
    code: 'CySEC',
    country: 'CY' as CountryCode,
    name: 'Cyprus Securities and Exchange Commission',
    shortName: 'CySEC',
    description:
      'CySEC regulates investment services in Cyprus and is widely seen as the gateway to the EU under MiFID II passporting. Many large retail brokers hold a CySEC license plus one or more "passported" authorisations across EEA.',
    investorProtection: {
      amount: 20000,
      currency: 'EUR',
      description: 'Up to €20,000 per eligible claimant via the Investor Compensation Fund (ICF).',
    },
    verificationUrl: 'https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/',
    tier: 'tier1',
  },
  {
    code: 'FSA',
    country: 'JP' as CountryCode,
    name: 'Financial Services Agency',
    shortName: 'Japan FSA',
    description:
      'The FSA is the Japanese integrated financial regulator. It supervises banks, insurance companies, securities firms and FX margin brokers. Maximum leverage is capped at 1:25 for retail FX.',
    investorProtection: {
      amount: 0,
      currency: 'JPY',
      description: 'No statutory compensation; client funds must be segregated at a Japanese financial institution.',
    },
    verificationUrl: 'https://www.fsa.go.jp/en/',
    tier: 'tier1',
  },
  {
    code: 'MAS',
    country: 'SG' as CountryCode,
    name: 'Monetary Authority of Singapore',
    shortName: 'MAS',
    description:
      'MAS regulates financial services in Singapore and is widely considered the gold standard for Asia-Pacific retail broker oversight. Retail leverage capped at 1:20 for major FX pairs.',
    investorProtection: {
      amount: 0,
      currency: 'SGD',
      description: 'No statutory deposit insurance; client assets must be segregated.',
    },
    verificationUrl: 'https://eservices.mas.gov.sg/fid/',
    tier: 'tier1',
  },
  {
    code: 'BaFin',
    country: 'DE' as CountryCode,
    name: 'Federal Financial Supervisory Authority',
    shortName: 'BaFin',
    description:
      'BaFin supervises banks, insurance, securities and asset management in Germany. German regulation is widely respected in the EU.',
    investorProtection: {
      amount: 100000,
      currency: 'EUR',
      description: 'Up to €100,000 per depositor via the German Deposit Protection Fund.',
    },
    verificationUrl: 'https://portal.mvp.bafin.de/database/InstInfo/',
    tier: 'tier1',
  },
  {
    code: 'FSCA',
    country: 'ZA' as CountryCode,
    name: 'Financial Sector Conduct Authority',
    shortName: 'FSCA',
    description:
      'FSCA regulates South African financial services. Leverage capped at 1:500 for major FX; client funds segregated.',
    investorProtection: {
      amount: 0,
      currency: 'ZAR',
      description: 'No statutory compensation; client funds must be segregated.',
    },
    verificationUrl: 'https://www.fsca.co.za/Fais/Search_FSP.htm',
    tier: 'tier2',
  },
  {
    code: 'SVG FSA',
    country: 'VC' as CountryCode,
    name: 'St. Vincent & the Grenadines Financial Services Authority',
    shortName: 'SVG FSA',
    description:
      'St. Vincent & the Grenadines does NOT regulate FX trading. The "SVG FSA" registration is a company registry listing, not a financial regulator. Brokers using this designation are not subject to conduct or capital rules.',
    investorProtection: {
      amount: 0,
      currency: 'USD',
      description: 'No investor protection whatsoever. No recourse if the broker fails.',
    },
    verificationUrl: '',
    tier: 'offshore',
  },
  {
    code: 'IFSC',
    country: 'BZ' as CountryCode,
    name: 'International Financial Services Commission (Belize)',
    shortName: 'IFSC',
    description:
      'The IFSC in Belize is a light-touch regulator. It licenses FX brokers but with limited oversight, no capital adequacy checks comparable to FCA/ASIC, and no investor compensation scheme.',
    investorProtection: {
      amount: 0,
      currency: 'USD',
      description: 'No statutory compensation.',
    },
    verificationUrl: 'https://www.ifsc.gov.bz/',
    tier: 'tier3',
  },
]

/** Index for fast lookup by code. */
export const REGULATORS_BY_CODE = Object.fromEntries(
  REGULATORS.map(r => [r.code, r]),
) as Record<string, Regulator>