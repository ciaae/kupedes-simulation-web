export type PaymentPattern = 'REGULER' | 'SEKALI_BAYAR' | 'BERJANGKA';
export type BerjangkaType = 3 | 4 | 6;

interface RateConfig {
  minAmount: number;
  maxAmount: number;
  admin: number;
  provisi: number;
  rates: {
    [key: number]: number;
  };
}

interface BerjangkaConfig {
  minAmount: number;
  maxAmount: number;
  admin: number;
  provisi: number;
  berjangka3?: { [tenor: number]: number };
  berjangka4?: { [tenor: number]: number };
  berjangka6?: { [tenor: number]: number };
}

// REGULER pattern rates
const REGULER_RATES: RateConfig[] = [
  {
    minAmount: 20.1e6,
    maxAmount: 25e6,
    admin: 50000,
    provisi: 0,
    rates: { 12: 1.20, 18: 1.25, 24: 1.25, 36: 1.25, 48: 1.29, 60: 1.33 },
  },
  {
    minAmount: 25.1e6,
    maxAmount: 50e6,
    admin: 100000,
    provisi: 0,
    rates: { 12: 1.20, 18: 1.25, 24: 1.25, 36: 1.25, 48: 1.29, 60: 1.33 },
  },
  {
    minAmount: 50.1e6,
    maxAmount: 100e6,
    admin: 150000,
    provisi: 1,
    rates: { 12: 1.00, 18: 1.04, 24: 1.04, 36: 1.04, 48: 1.07, 60: 1.10 },
  },
  {
    minAmount: 100.1e6,
    maxAmount: 150e6,
    admin: 200000,
    provisi: 1,
    rates: { 12: 0.91, 18: 0.90, 24: 0.93, 36: 0.93, 48: 0.95, 60: 0.97 },
  },
  {
    minAmount: 150.1e6,
    maxAmount: 200e6,
    admin: 250000,
    provisi: 1,
    rates: { 12: 0.91, 18: 0.90, 24: 0.93, 36: 0.93, 48: 0.95, 60: 0.97 },
  },
  {
    minAmount: 200.1e6,
    maxAmount: 250e6,
    admin: 250000,
    provisi: 1,
    rates: { 12: 0.91, 18: 0.90, 24: 0.93, 36: 0.93, 48: 0.95, 60: 0.97 },
  },
  {
    minAmount: 250.1e6,
    maxAmount: 500e6,
    admin: 450000,
    provisi: 0.75,
    rates: { 12: 0.91, 18: 0.90, 24: 0.93, 36: 0.93, 48: 0.95, 60: 0.97 },
  },
];

// SEKALI BAYAR pattern rates
const SEKALI_BAYAR_RATES: RateConfig[] = [
  {
    minAmount: 20.1e6,
    maxAmount: 25e6,
    admin: 50000,
    provisi: 0,
    rates: { 3: 6.38, 4: 8.50, 6: 12.75 },
  },
  {
    minAmount: 25.1e6,
    maxAmount: 50e6,
    admin: 100000,
    provisi: 0,
    rates: { 3: 6.38, 4: 8.50, 6: 12.75 },
  },
  {
    minAmount: 50.1e6,
    maxAmount: 100e6,
    admin: 150000,
    provisi: 1,
    rates: { 3: 5.38, 4: 7.17, 6: 10.75 },
  },
  {
    minAmount: 100.1e6,
    maxAmount: 150e6,
    admin: 200000,
    provisi: 1,
    rates: { 3: 4.88, 4: 6.50, 6: 9.75 },
  },
  {
    minAmount: 150.1e6,
    maxAmount: 200e6,
    admin: 250000,
    provisi: 1,
    rates: { 3: 4.88, 4: 6.50, 6: 9.75 },
  },
  {
    minAmount: 200.1e6,
    maxAmount: 250e6,
    admin: 250000,
    provisi: 1,
    rates: { 3: 4.88, 4: 6.50, 6: 9.75 },
  },
  {
    minAmount: 250.1e6,
    maxAmount: 500e6,
    admin: 450000,
    provisi: 0.75,
    rates: { 3: 4.88, 4: 6.50, 6: 9.75 },
  },
];

// BERJANGKA pattern rates
const BERJANGKA_RATES: BerjangkaConfig[] = [
  {
    minAmount: 20.1e6,
    maxAmount: 25e6,
    admin: 50000,
    provisi: 0,
    berjangka3: { 12: 1.37, 18: 1.39, 24: 1.41, 36: 1.47 },
    berjangka4: { 12: 1.46, 24: 1.49, 36: 1.55 },
    berjangka6: { 12: 1.63, 18: 1.64, 24: 1.65, 36: 1.71 },
  },
  {
    minAmount: 25.1e6,
    maxAmount: 50e6,
    admin: 100000,
    provisi: 0,
    berjangka3: { 12: 1.37, 18: 1.39, 24: 1.41, 36: 1.47 },
    berjangka4: { 12: 1.46, 24: 1.49, 36: 1.55 },
    berjangka6: { 12: 1.63, 18: 1.64, 24: 1.65, 36: 1.71 },
  },
  {
    minAmount: 50.1e6,
    maxAmount: 100e6,
    admin: 150000,
    provisi: 1,
    berjangka3: { 12: 1.15, 18: 1.16, 24: 1.18, 36: 1.23 },
    berjangka4: { 12: 1.22, 24: 1.25, 36: 1.30 },
    berjangka6: { 12: 1.37, 18: 1.38, 24: 1.39, 36: 1.44 },
  },
  {
    minAmount: 100.1e6,
    maxAmount: 150e6,
    admin: 200000,
    provisi: 1,
    berjangka3: { 12: 1.04, 18: 1.05, 24: 1.06, 36: 1.10 },
    berjangka4: { 12: 1.11, 24: 1.13, 36: 1.16 },
    berjangka6: { 12: 1.24, 18: 1.25, 24: 1.25, 36: 1.29 },
  },
  {
    minAmount: 150.1e6,
    maxAmount: 200e6,
    admin: 250000,
    provisi: 1,
    berjangka3: { 12: 1.04, 18: 1.05, 24: 1.06, 36: 1.10 },
    berjangka4: { 12: 1.11, 24: 1.13, 36: 1.16 },
    berjangka6: { 12: 1.24, 18: 1.25, 24: 1.25, 36: 1.29 },
  },
  {
    minAmount: 200.1e6,
    maxAmount: 250e6,
    admin: 250000,
    provisi: 1,
    berjangka3: { 12: 1.04, 18: 1.05, 24: 1.06, 36: 1.10 },
    berjangka4: { 12: 1.11, 24: 1.13, 36: 1.16 },
    berjangka6: { 12: 1.24, 18: 1.25, 24: 1.25, 36: 1.29 },
  },
  {
    minAmount: 250.1e6,
    maxAmount: 500e6,
    admin: 450000,
    provisi: 0.75,
    berjangka3: { 12: 1.04, 18: 1.05, 24: 1.06, 36: 1.10 },
    berjangka4: { 12: 1.11, 24: 1.13, 36: 1.16 },
    berjangka6: { 12: 1.24, 18: 1.25, 24: 1.25, 36: 1.29 },
  },
];

function findRateConfig(
  amount: number,
  rates: RateConfig[]
): RateConfig | null {
  for (const config of rates) {
    if (amount > config.minAmount && amount <= config.maxAmount) {
      return config;
    }
  }
  return null;
}

function findBerjangkaConfig(
  amount: number,
  rates: BerjangkaConfig[]
): BerjangkaConfig | null {
  for (const config of rates) {
    if (amount > config.minAmount && amount <= config.maxAmount) {
      return config;
    }
  }
  return null;
}

export interface LoanCalculationResult {
  angsuran: number;
  adminFee: number;
  provisi: number;
  sewaModal: number;
  total: number;
  interestRate: number;
  details?: string;
}

export function getAvailableTenors(pattern: PaymentPattern): number[] {
  switch (pattern) {
    case 'REGULER':
      return [12, 18, 24, 36, 48, 60];
    case 'SEKALI_BAYAR':
      return [3, 4, 6];
    case 'BERJANGKA':
      return [12, 18, 24, 36];
    default:
      return [];
  }
}

export function getAvailableBerjangkaTypes(
  loanAmount: number,
  tenor: number
): BerjangkaType[] {
  const config = findBerjangkaConfig(loanAmount, BERJANGKA_RATES);
  if (!config) return [];

  const available: BerjangkaType[] = [];

  if (config.berjangka3 && config.berjangka3[tenor] !== undefined) {
    available.push(3);
  }
  if (config.berjangka4 && config.berjangka4[tenor] !== undefined) {
    available.push(4);
  }
  if (config.berjangka6 && config.berjangka6[tenor] !== undefined) {
    available.push(6);
  }

  return available;
}

export function calculateLoan(
  loanAmount: number,
  pattern: PaymentPattern,
  tenor: number,
  berjangkaType?: BerjangkaType
): LoanCalculationResult {
  if (pattern === 'REGULER') {
    const config = findRateConfig(loanAmount, REGULER_RATES);
    if (!config) throw new Error('Loan amount not in valid range');

    const rate = config.rates[tenor];
    if (rate === undefined)
      throw new Error(`Tenor ${tenor} not available for this pattern`);

    // Sewa Modal per bulan = (Uang Pinjaman × Sewa Modal % × Tenor) / Tenor = Uang Pinjaman × Sewa Modal %
    const sewaModalPerBulan = (loanAmount * rate) / 100;
    const adminFee = config.admin;
    const provisi = config.provisi > 0 ? (loanAmount * config.provisi) / 100 : 0;
    
    // Angsuran hanya sewa modal per bulan, tidak termasuk admin dan provisi
    const totalSewaModal = sewaModalPerBulan * tenor;
    const totalCost = loanAmount + totalSewaModal + adminFee + provisi;

    return {
      angsuran: Math.round(sewaModalPerBulan),
      adminFee,
      provisi: Math.round(provisi),
      sewaModal: Math.round(totalSewaModal),
      total: Math.round(totalCost),
      interestRate: rate,
    };
  } else if (pattern === 'SEKALI_BAYAR') {
    const config = findRateConfig(loanAmount, SEKALI_BAYAR_RATES);
    if (!config) throw new Error('Loan amount not in valid range');

    const rate = config.rates[tenor];
    if (rate === undefined)
      throw new Error(`Tenor ${tenor} not available for this pattern`);

    // For SEKALI_BAYAR, sewa modal is flat percentage
    const sewaModal = (loanAmount * rate) / 100;
    const adminFee = config.admin;
    const provisi = config.provisi > 0 ? (loanAmount * config.provisi) / 100 : 0;
    
    // Total yang harus dibayar sekaligus
    const totalPayment = loanAmount + sewaModal + adminFee + provisi;

    return {
      angsuran: Math.round(sewaModal),
      adminFee,
      provisi: Math.round(provisi),
      sewaModal: Math.round(sewaModal),
      total: Math.round(totalPayment),
      interestRate: rate,
    };
  } else if (pattern === 'BERJANGKA') {
    if (!berjangkaType) throw new Error('Berjangka type must be specified');

    const config = findBerjangkaConfig(loanAmount, BERJANGKA_RATES);
    if (!config) throw new Error('Loan amount not in valid range');

    let rateTable: { [tenor: number]: number } | undefined;
    if (berjangkaType === 3) {
      rateTable = config.berjangka3;
    } else if (berjangkaType === 4) {
      rateTable = config.berjangka4;
    } else if (berjangkaType === 6) {
      rateTable = config.berjangka6;
    }

    if (!rateTable)
      throw new Error('Berjangka type not available for this amount');

    const rate = rateTable[tenor];
    if (rate === undefined)
      throw new Error(`Tenor ${tenor} not available for this pattern`);

    // Sewa Modal per bulan (same as REGULER)
    const sewaModalPerBulan = (loanAmount * rate) / 100;
    const adminFee = config.admin;
    const provisi = config.provisi > 0 ? (loanAmount * config.provisi) / 100 : 0;
    
    // Angsuran per periode = sewa modal per bulan × jumlah bulan per periode
    const periodMonths = berjangkaType;
    const angsuranPerPeriode = sewaModalPerBulan * periodMonths;
    
    const totalSewaModal = sewaModalPerBulan * tenor;
    const totalCost = loanAmount + totalSewaModal + adminFee + provisi;

    return {
      angsuran: Math.round(angsuranPerPeriode),
      adminFee,
      provisi: Math.round(provisi),
      sewaModal: Math.round(totalSewaModal),
      total: Math.round(totalCost),
      interestRate: rate,
      details: `Per ${berjangkaType} bulan (${tenor / periodMonths} periode)`,
    };
  }

  throw new Error('Invalid pattern');
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
