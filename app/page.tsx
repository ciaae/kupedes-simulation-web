'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  calculateLoan,
  type LoanCalculationResult,
  type PaymentPattern,
} from '@/lib/loan-calculator';

export default function Home() {
  const [loanAmount, setLoanAmount] = useState(50_000_000);
  const [tenor, setTenor] = useState(12);
  const [pattern, setPattern] = useState<PaymentPattern>('REGULER');
  const [result, setResult] = useState<LoanCalculationResult | null>(null);

  const handleSimulate = () => {
    const calculation = calculateLoan(loanAmount, tenor, pattern);
    setResult(calculation);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const tenorOptions = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b border-emerald-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
              <span className="text-lg font-bold text-white">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-900">KUPEDES Loan Simulator</h1>
              <p className="text-sm text-emerald-700">Pegadaian&apos;s Micro-Business Loan Calculator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="border-emerald-100 bg-white p-6 shadow-md">
              <h2 className="mb-6 text-lg font-semibold text-emerald-900">Loan Details</h2>

              {/* Loan Amount */}
              <div className="mb-6 space-y-2">
                <Label htmlFor="loan-amount" className="text-emerald-900">
                  Loan Amount (Rp)
                </Label>
                <Input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                  className="border-emerald-200 text-emerald-900 placeholder-emerald-400"
                  placeholder="50000000"
                />
                <p className="text-xs text-emerald-600">{formatCurrency(loanAmount)}</p>
              </div>

              {/* Payment Pattern */}
              <div className="mb-6 space-y-2">
                <Label htmlFor="pattern" className="text-emerald-900">
                  Payment Pattern
                </Label>
                <Select value={pattern} onValueChange={(value) => setPattern(value as PaymentPattern)}>
                  <SelectTrigger id="pattern" className="border-emerald-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REGULER">Reguler (Monthly)</SelectItem>
                    <SelectItem value="SEKALI_BAYAR">Sekali Bayar (Lump Sum)</SelectItem>
                    <SelectItem value="BERJANGKA">Berjangka (Tiered)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tenor */}
              <div className="mb-8 space-y-2">
                <Label htmlFor="tenor" className="text-emerald-900">
                  Tenor (Months)
                </Label>
                <Select value={tenor.toString()} onValueChange={(value) => setTenor(Number(value))}>
                  <SelectTrigger id="tenor" className="border-emerald-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {tenorOptions.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month} month{month !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Simulate Button */}
              <Button
                onClick={handleSimulate}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Simulasikan
              </Button>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-emerald-200 bg-emerald-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-emerald-900">Sewa Modal</h3>
                <p className="text-xs text-emerald-700 mb-2">Monthly fee charged throughout loan tenure</p>
                <p className="text-lg font-bold text-emerald-600">Rp 25,000/month</p>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-emerald-900">Provisi</h3>
                <p className="text-xs text-emerald-700 mb-2">One-time administration fee</p>
                <p className="text-lg font-bold text-emerald-600">2% of loan amount</p>
              </Card>
            </div>

            <Card className="border-emerald-200 bg-emerald-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-emerald-900">Berjangka Payment Timing</h3>
              <p className="text-xs text-emerald-700">
                Payments divided into 3 periods throughout the loan tenure. Payment amounts may vary per period based on the selected payment schedule.
              </p>
            </Card>

            {/* Calculation Results */}
            {result && (
              <Card className="border-emerald-300 bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-emerald-900">Simulation Results</h2>

                {/* Summary */}
                <div className="mb-6 space-y-3 border-b border-emerald-100 pb-6">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Loan Amount:</span>
                    <span className="font-semibold text-emerald-900">
                      {formatCurrency(result.loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Annual Rate:</span>
                    <span className="font-semibold text-emerald-900">{result.annualRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Provisi (2%):</span>
                    <span className="font-semibold text-emerald-900">
                      {formatCurrency(result.provisi)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Sewa Modal ({result.tenor} months):</span>
                    <span className="font-semibold text-emerald-900">
                      {formatCurrency(result.sewaModal)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-emerald-100 p-2 rounded">
                    <span className="font-semibold text-emerald-900">Net Loan (After Fees):</span>
                    <span className="font-bold text-emerald-700">
                      {formatCurrency(result.netLoanAmount)}
                    </span>
                  </div>
                </div>

                {/* Payment Details */}
                {result.pattern === 'REGULER' && result.details.reguler && (
                  <div>
                    <h3 className="mb-3 font-semibold text-emerald-900">Monthly Installment Schedule</h3>
                    <div className="mb-4 grid gap-2">
                      <div className="flex justify-between text-sm font-semibold text-emerald-700 mb-2">
                        <span>Month</span>
                        <span>Payment</span>
                        <span>Interest</span>
                        <span>Balance</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-1 text-xs">
                        {result.details.reguler.schedule.slice(0, 12).map((row) => (
                          <div
                            key={row.month}
                            className="flex justify-between rounded px-2 py-1 hover:bg-emerald-50"
                          >
                            <span className="text-emerald-600 font-medium w-12">{row.month}</span>
                            <span className="text-emerald-900 font-semibold">
                              {formatCurrency(row.payment)}
                            </span>
                            <span className="text-emerald-700">{formatCurrency(row.interest)}</span>
                            <span className="text-emerald-600">{formatCurrency(row.balance)}</span>
                          </div>
                        ))}
                        {result.details.reguler.schedule.length > 12 && (
                          <div className="text-center py-2 text-emerald-500 text-xs italic">
                            ... and {result.details.reguler.schedule.length - 12} more months
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between bg-emerald-100 p-2 rounded font-semibold text-emerald-900">
                      <span>Total Amount to Pay:</span>
                      <span>{formatCurrency(result.details.reguler.totalPayment)}</span>
                    </div>
                  </div>
                )}

                {result.pattern === 'SEKALI_BAYAR' && result.details.sekaliBayar && (
                  <div>
                    <h3 className="mb-3 font-semibold text-emerald-900">Lump Sum Payment</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Loan Principal:</span>
                        <span className="font-semibold text-emerald-900">
                          {formatCurrency(result.loanAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Total Interest ({result.annualRate}% per year):</span>
                        <span className="font-semibold text-emerald-900">
                          {formatCurrency(result.details.sekaliBayar.totalInterest)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between bg-emerald-100 p-3 rounded font-bold text-emerald-900 text-lg">
                      <span>Payment Due at Month {result.tenor}:</span>
                      <span>{formatCurrency(result.details.sekaliBayar.finalPayment)}</span>
                    </div>
                  </div>
                )}

                {result.pattern === 'BERJANGKA' && result.details.berjangka && (
                  <div>
                    <h3 className="mb-3 font-semibold text-emerald-900">Tiered Payment Schedule</h3>
                    <div className="space-y-2 mb-4">
                      {result.details.berjangka.schedule.map((row, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded hover:bg-emerald-50">
                          <span className="text-emerald-700 font-medium">Period {idx + 1} ({row.description}):</span>
                          <span className="font-semibold text-emerald-900">
                            {formatCurrency(row.payment)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between bg-emerald-100 p-3 rounded font-bold text-emerald-900 text-lg">
                      <span>Total Amount to Pay:</span>
                      <span>{formatCurrency(result.details.berjangka.totalPayment)}</span>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {!result && (
              <Card className="border-dashed border-2 border-emerald-200 bg-emerald-50 p-8 text-center">
                <p className="text-emerald-700">
                  Click &quot;Simulasikan&quot; to see your loan calculation results
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
