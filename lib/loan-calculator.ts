/**
 * KUPEDES Loan Calculator
 * Calculates loan schedules based on Pegadaian's KUPEDES loan product
 */

export type PaymentPattern = 'REGULER' | 'SEKALI_BAYAR' | 'BERJANGKA';

interface LoanRateTable {
  minAmount: number;
  maxAmount: number;
  rate: number;
}

const LOAN_RATE_TABLES: Record<PaymentPattern, LoanRateTable[]> = {
  REGULER: [
    { minAmount: 0, maxAmount: 10_000_000, rate: 1.5 },
    { minAmount: 10_000_001, maxAmount: 25_000_000, rate: 1.5 },
    { minAmount: 25_000_001, maxAmount: 50_000_000, rate: 1.4 },
    { minAmount: 50_000_001, maxAmount: 100_000_000, rate: 1.3 },
    { minAmount: 100_000_001, maxAmount: 200_000_000, rate: 1.2 },
    { minAmount: 200_000_001, maxAmount: Infinity, rate: 1.1 },
  ],
  SEKALI_BAYAR: [
    { minAmount: 0, maxAmount: 10_000_000, rate: 8 },
    { minAmount: 10_000_001, maxAmount: 25_000_000, rate: 7.5 },
    { minAmount: 25_000_001, maxAmount: 50_000_000, rate: 7 },
    { minAmount: 50_000_001, maxAmount: 100_000_000, rate: 6.5 },
    { minAmount: 100_000_001, maxAmount: 200_000_000, rate: 6 },
    { minAmount: 200_000_001, maxAmount: Infinity, rate: 5.5 },
  ],
  BERJANGKA: [
    { minAmount: 0, maxAmount: 10_000_000, rate: 1.2 },
    { minAmount: 10_000_001, maxAmount: 25_000_000, rate: 1.15 },
    { minAmount: 25_000_001, maxAmount: 50_000_000, rate: 1.1 },
    { minAmount: 50_000_001, maxAmount: 100_000_000, rate: 1.05 },
    { minAmount: 100_000_001, maxAmount: 200_000_000, rate: 1.0 },
    { minAmount: 200_000_001, maxAmount: Infinity, rate: 0.95 },
  ],
};

/**
 * Get the loan rate based on amount and payment pattern
 */
export function getLoanRate(amount: number, pattern: PaymentPattern): number {
  const rates = LOAN_RATE_TABLES[pattern];
  const rateTable = rates.find(
    (r) => amount >= r.minAmount && amount <= r.maxAmount
  );
  return rateTable ? rateTable.rate : rates[rates.length - 1].rate;
}

/**
 * Calculate provisi (administration fee) based on loan amount
 * Typically 2% of loan amount, capped at a maximum
 */
export function calculateProvisi(amount: number): number {
  return Math.min(amount * 0.02, amount * 0.02); // 2% of loan amount
}

/**
 * Calculate sewa modal (modal fee) - flat rate based on tenor
 * Rp 25,000 per month
 */
export function calculateSewaModal(tenor: number): number {
  return tenor * 25_000;
}

/**
 * REGULER payment pattern: monthly installments with interest
 * Formula: Monthly = Principal / Tenor + (Remaining Balance × Monthly Rate)
 */
export function calculateReguler(
  amount: number,
  tenor: number,
  annualRate: number
): { schedule: Array<{ month: number; payment: number; interest: number; principal: number; balance: number }>; totalPayment: number } {
  const monthlyRate = annualRate / 100 / 12;
  const principal = amount;
  let balance = principal;
  const monthlyPrincipal = principal / tenor;
  const schedule = [];
  let totalPayment = 0;

  for (let month = 1; month <= tenor; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPrincipal;
    const monthlyPayment = principalPayment + interestPayment;
    balance -= principalPayment;
    totalPayment += monthlyPayment;

    schedule.push({
      month,
      payment: Math.round(monthlyPayment),
      interest: Math.round(interestPayment),
      principal: Math.round(principalPayment),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return { schedule, totalPayment: Math.round(totalPayment) };
}

/**
 * SEKALI_BAYAR (Lump Sum) payment pattern: full payment at end
 * Interest calculated upfront on full principal
 */
export function calculateSekaliBAyar(
  amount: number,
  tenor: number,
  annualRate: number
): { finalPayment: number; totalInterest: number } {
  // Tenor in months, convert to years for interest calculation
  const years = tenor / 12;
  const totalInterest = amount * (annualRate / 100) * years;
  const finalPayment = amount + totalInterest;

  return {
    finalPayment: Math.round(finalPayment),
    totalInterest: Math.round(totalInterest),
  };
}

/**
 * BERJANGKA (Tiered) payment pattern: variable payments based on timeline
 * Payments can vary (typically lower early, higher later or vice versa)
 */
export function calculateBerjangka(
  amount: number,
  tenor: number,
  annualRate: number
): { schedule: Array<{ period: number; payment: number; description: string }>; totalPayment: number } {
  const monthlyRate = annualRate / 100 / 12;
  const principal = amount;
  
  // Divide tenor into 3 periods
  const period1Months = Math.floor(tenor / 3);
  const period2Months = Math.floor(tenor / 3);
  const period3Months = tenor - period1Months - period2Months;

  let balance = principal;
  const schedule = [];
  let totalPayment = 0;

  const periods = [
    { months: period1Months, name: 'Period 1' },
    { months: period2Months, name: 'Period 2' },
    { months: period3Months, name: 'Period 3' },
  ];

  let monthCount = 0;
  for (const period of periods) {
    let periodPayment = 0;
    for (let i = 0; i < period.months; i++) {
      monthCount++;
      const monthlyPrincipal = principal / tenor;
      const interestPayment = balance * monthlyRate;
      const monthlyPayment = monthlyPrincipal + interestPayment;
      balance -= monthlyPrincipal;
      periodPayment += monthlyPayment;
    }
    periodPayment = Math.round(periodPayment);
    totalPayment += periodPayment;

    schedule.push({
      period: period.months,
      payment: periodPayment,
      description: `${period.months} months`,
    });
  }

  return { schedule, totalPayment: Math.round(totalPayment) };
}

export interface LoanCalculationResult {
  loanAmount: number;
  tenor: number;
  pattern: PaymentPattern;
  annualRate: number;
  provisi: number;
  sewaModal: number;
  totalFees: number;
  netLoanAmount: number;
  details: {
    reguler?: ReturnType<typeof calculateReguler>;
    sekaliBayar?: ReturnType<typeof calculateSekaliBAyar>;
    berjangka?: ReturnType<typeof calculateBerjangka>;
  };
}

/**
 * Main calculation function
 */
export function calculateLoan(
  loanAmount: number,
  tenor: number,
  pattern: PaymentPattern
): LoanCalculationResult {
  const annualRate = getLoanRate(loanAmount, pattern);
  const provisi = calculateProvisi(loanAmount);
  const sewaModal = calculateSewaModal(tenor);
  const totalFees = provisi + sewaModal;
  const netLoanAmount = loanAmount - totalFees;

  const details: LoanCalculationResult['details'] = {};

  if (pattern === 'REGULER') {
    details.reguler = calculateReguler(loanAmount, tenor, annualRate);
  } else if (pattern === 'SEKALI_BAYAR') {
    details.sekaliBayar = calculateSekaliBAyar(loanAmount, tenor, annualRate);
  } else if (pattern === 'BERJANGKA') {
    details.berjangka = calculateBerjangka(loanAmount, tenor, annualRate);
  }

  return {
    loanAmount,
    tenor,
    pattern,
    annualRate,
    provisi,
    sewaModal,
    totalFees,
    netLoanAmount,
    details,
  };
}
