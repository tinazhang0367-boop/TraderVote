import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const brokers = [
  { slug: 'exness', name: 'Exness', regulators: ['CySEC', 'FCA', 'FSA', 'CMA'], founded: 2008, headquarters: 'Limassol, Cyprus', minDeposit: { amount: 1, currency: 'USD' }, maxLeverage: '1:Unlimited', spreadsFrom: 0.3, platforms: ['MT4', 'MT5', 'Exness Terminal'], trustScore: 4.8, trustBand: 'excellent', reviewCount: 2341, rank: 1, description: 'CySEC + FCA + FSA + CMA regulated broker offering low minimums and fast withdrawals.' },
  { slug: 'xm', name: 'XM Group', regulators: ['CySEC', 'ASIC', 'IFSC'], founded: 2009, headquarters: 'Limassol, Cyprus', minDeposit: { amount: 5, currency: 'USD' }, maxLeverage: '1:888', spreadsFrom: 0.6, platforms: ['MT4', 'MT5'], trustScore: 4.4, trustBand: 'great', reviewCount: 1892, rank: 2, description: 'CySEC + ASIC regulated broker popular with bonus-seeking beginners.' },
  { slug: 'fxgt', name: 'FXGT.com', regulators: ['CySEC', 'FSA'], founded: 2019, headquarters: 'Cyprus', minDeposit: { amount: 5, currency: 'USD' }, maxLeverage: '1:500', spreadsFrom: 0.8, platforms: ['MT4', 'MT5'], trustScore: 4.2, trustBand: 'great', reviewCount: 1204, rank: 3, description: 'Mid-tier broker with crypto and forex offering.' },
  { slug: 'icmarkets', name: 'IC Markets', regulators: ['ASIC', 'CySEC', 'FSA'], founded: 2007, headquarters: 'Sydney, Australia', minDeposit: { amount: 200, currency: 'USD' }, maxLeverage: '1:500', spreadsFrom: 0, platforms: ['MT4', 'MT5', 'cTrader'], trustScore: 4.1, trustBand: 'great', reviewCount: 986, rank: 4, description: 'ECN broker favoured by algorithmic and scalping traders.' },
  { slug: 'pepperstone', name: 'Pepperstone', regulators: ['ASIC', 'FCA', 'DFSA'], founded: 2010, headquarters: 'Melbourne, Australia', minDeposit: { amount: 200, currency: 'USD' }, maxLeverage: '1:500', spreadsFrom: 0, platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'], trustScore: 3.9, trustBand: 'average', reviewCount: 742, rank: 5, description: 'Australia-based broker popular with professional traders.' },
]

const regulators = [
  { code: 'FCA', name: 'Financial Conduct Authority', shortName: 'UK FCA', country: 'GB', tier: 'tier1', verificationUrl: 'https://register.fca.org.uk/' },
  { code: 'ASIC', name: 'Australian Securities and Investments Commission', shortName: 'ASIC', country: 'AU', tier: 'tier1', verificationUrl: 'https://connectonline.asic.gov.au/' },
  { code: 'CySEC', name: 'Cyprus Securities and Exchange Commission', shortName: 'CySEC', country: 'CY', tier: 'tier1', verificationUrl: 'https://www.cysec.gov.cy/' },
  { code: 'FSA', name: 'Financial Services Authority', shortName: 'FSA', country: 'VC', tier: 'offshore', verificationUrl: '' },
]

for (const regulator of regulators) {
  await prisma.regulator.upsert({
    where: { code: regulator.code },
    update: regulator,
    create: regulator,
  })
}

for (const broker of brokers) {
  const { minDeposit, ...brokerData } = broker
  const saved = await prisma.broker.upsert({
    where: { slug: broker.slug },
    update: {
      ...brokerData,
      regulators: JSON.stringify(broker.regulators),
      platforms: JSON.stringify(broker.platforms),
      minDepositJson: JSON.stringify(minDeposit),
    },
    create: {
      ...brokerData,
      regulators: JSON.stringify(broker.regulators),
      platforms: JSON.stringify(broker.platforms),
      minDepositJson: JSON.stringify(minDeposit),
    },
  })

  for (const code of broker.regulators) {
    const regulator = await prisma.regulator.findUnique({ where: { code } })
    if (!regulator) continue
    await prisma.license.upsert({
      where: { brokerId_regulatorId: { brokerId: saved.id, regulatorId: regulator.id } },
      update: { status: 'ACTIVE' },
      create: { brokerId: saved.id, regulatorId: regulator.id, status: 'ACTIVE' },
    })
  }
}

await prisma.aiTask.deleteMany({
  where: { status: 'QUEUED' },
})

await prisma.aiTask.createMany({
  data: [
    { type: 'NEWS_COLLECT', targetType: 'broker', status: 'QUEUED', inputJson: '{"source":"regulators"}' },
    { type: 'BLOG_DRAFT', targetType: 'seo', status: 'QUEUED', inputJson: '{"topic":"如何核验外汇经纪商监管牌照"}' },
    { type: 'REVIEW_SUMMARY', targetType: 'broker', targetId: 'exness', status: 'QUEUED' },
  ],
})

await prisma.$disconnect()
