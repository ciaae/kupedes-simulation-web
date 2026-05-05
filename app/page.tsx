'use client';

import { useState, useEffect } from 'react';
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
  getAvailableTenors,
  getAvailableBerjangkaTypes,
  formatRupiah,
  type LoanCalculationResult,
  type PaymentPattern,
  type BerjangkaType,
} from '@/lib/loan-calculator';

export default function Home() {
  const [loanAmount, setLoanAmount] = useState(50_000_000);
  const [tenor, setTenor] = useState(12);
  const [pattern, setPattern] = useState<PaymentPattern>('REGULER');
  const [berjangkaType, setBerjangkaType] = useState<BerjangkaType>(3);
  const [result, setResult] = useState<LoanCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableTenors = getAvailableTenors(pattern);

  // Reset tenor to first available when pattern changes
  useEffect(() => {
    const tenors = getAvailableTenors(pattern);
    if (!tenors.includes(tenor)) {
      setTenor(tenors[0]);
    }
  }, [pattern, tenor]);

  // Auto-calculate on load
  useEffect(() => {
    handleSimulate();
  }, []);

  const handleSimulate = () => {
    try {
      setError(null);
      let calculation: LoanCalculationResult;

      if (pattern === 'BERJANGKA') {
        calculation = calculateLoan(
          loanAmount,
          pattern,
          tenor,
          berjangkaType
        );
      } else {
        calculation = calculateLoan(loanAmount, pattern, tenor);
      }

      setResult(calculation);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Calculation error occurred'
      );
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header
        className="border-b shadow-sm"
        style={{ backgroundColor: '#ffffff', borderColor: '#e0e0e0' }}
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg font-bold text-white text-lg"
              style={{ backgroundColor: '#00843D' }}
            >
              K
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: '#00843D' }}
              >
                KUPEDES Simulasi Pembiayaan
              </h1>
              <p style={{ color: '#666666' }}>Kalkulator pembiayaan mikro bisnis Pegadaian</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card
              className="p-6 shadow-md"
              style={{
                backgroundColor: '#ffffff',
                borderColor: '#e0e0e0',
              }}
            >
              <h2
                className="mb-6 text-lg font-semibold"
                style={{ color: '#00843D' }}
              >
                Detail Pembiayaan
              </h2>

              {/* Loan Amount */}
              <div className="mb-6 space-y-2">
                <Label
                  htmlFor="loan-amount"
                  style={{ color: '#00843D' }}
                >
                  Uang Pinjaman (Rp)
                </Label>
                <Input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value));
                    setLoanAmount(val);
                    handleSimulate();
                  }}
                  placeholder="50000000"
                  style={{
                    borderColor: '#d0d0d0',
                    color: '#333333',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666666' }}>
                  {formatRupiah(loanAmount)}
                </p>
              </div>

              {/* Payment Pattern */}
              <div className="mb-6 space-y-2">
                <Label
                  htmlFor="pattern"
                  style={{ color: '#00843D' }}
                >
                  Pola Angsuran
                </Label>
                <Select
                  value={pattern}
                  onValueChange={(value) => {
                    setPattern(value as PaymentPattern);
                    const tenors = getAvailableTenors(value as PaymentPattern);
                    setTenor(tenors[0]);
                  }}
                >
                  <SelectTrigger
                    id="pattern"
                    style={{ borderColor: '#d0d0d0' }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REGULER">Bulanan (REGULER)</SelectItem>
                    <SelectItem value="SEKALI_BAYAR">Sekali Bayar</SelectItem>
                    <SelectItem value="BERJANGKA">Berjangka</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tenor */}
              <div className="mb-6 space-y-2">
                <Label
                  htmlFor="tenor"
                  style={{ color: '#00843D' }}
                >
                  Jangka Waktu (bulan)
                </Label>
                <Select
                  value={tenor.toString()}
                  onValueChange={(value) => {
                    const val = Number(value);
                    setTenor(val);
                    handleSimulate();
                  }}
                >
                  <SelectTrigger
                    id="tenor"
                    style={{ borderColor: '#d0d0d0' }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTenors.map((t) => (
                      <SelectItem key={t} value={t.toString()}>
                        {t} bulan
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Berjangka Type - show only if BERJANGKA */}
              {pattern === 'BERJANGKA' && (
                <div className="mb-6 space-y-2">
                  <Label
                    htmlFor="berjangka-type"
                    style={{ color: '#00843D' }}
                  >
                    Tipe Periode
                  </Label>
                  <Select
                    value={berjangkaType.toString()}
                    onValueChange={(value) => {
                      const val = Number(value) as BerjangkaType;
                      setBerjangkaType(val);
                      handleSimulate();
                    }}
                  >
                    <SelectTrigger
                      id="berjangka-type"
                      style={{ borderColor: '#d0d0d0' }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableBerjangkaTypes(loanAmount, tenor).map(
                        (type) => (
                          <SelectItem
                            key={type}
                            value={type.toString()}
                          >
                            Per {type} bulan
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Simulate Button */}
              <Button
                onClick={handleSimulate}
                className="w-full text-white font-semibold"
                style={{
                  backgroundColor: '#00843D',
                }}
              >
                Simulasikan
              </Button>

              {error && (
                <div
                  className="mt-4 p-3 rounded text-sm"
                  style={{
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderLeft: '4px solid #c62828',
                  }}
                >
                  {error}
                </div>
              )}
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                className="p-4"
                style={{
                  backgroundColor: '#e8f5e9',
                  borderColor: '#c8e6c9',
                }}
              >
                <h3
                  className="mb-2 text-sm font-semibold"
                  style={{ color: '#00843D' }}
                >
                  Sewa Modal
                </h3>
                <p
                  className="text-xs mb-2"
                  style={{ color: '#666666' }}
                >
                  REGULER & BERJANGKA = per bulan
                </p>
              </Card>

              <Card
                className="p-4"
                style={{
                  backgroundColor: '#e8f5e9',
                  borderColor: '#c8e6c9',
                }}
              >
                <h3
                  className="mb-2 text-sm font-semibold"
                  style={{ color: '#00843D' }}
                >
                  Provisi
                </h3>
                <p
                  className="text-xs"
                  style={{ color: '#666666' }}
                >
                  Untuk pinjaman &gt; Rp 50 juta
                </p>
              </Card>
            </div>

            <Card
              className="p-4"
              style={{
                backgroundColor: '#e8f5e9',
                borderColor: '#c8e6c9',
              }}
            >
              <h3
                className="mb-2 text-sm font-semibold"
                style={{ color: '#00843D' }}
              >
                Periode Berjangka
              </h3>
              <p
                className="text-xs"
                style={{ color: '#666666' }}
              >
                Sewa modal SEKALI BAYAR = flat dari pokok
              </p>
            </Card>

            {/* Calculation Results */}
            {result && (
              <Card
                className="p-6 shadow-lg"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#c8e6c9',
                }}
              >
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{ color: '#00843D' }}
                >
                  Hasil Simulasi
                </h2>

                {/* Summary */}
                <div
                  className="mb-6 space-y-3 border-b pb-6"
                  style={{ borderColor: '#e0e0e0' }}
                >
                  <div className="flex justify-between">
                    <span style={{ color: '#666666' }}>Uang Pinjaman:</span>
                    <span
                      className="font-semibold"
                      style={{ color: '#00843D' }}
                    >
                      {formatRupiah(loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#666666' }}>Suku Bunga:</span>
                    <span
                      className="font-semibold"
                      style={{ color: '#00843D' }}
                    >
                      {result.interestRate}%
                    </span>
                  </div>
                  {result.adminFee > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: '#666666' }}>Biaya Admin:</span>
                      <span
                        className="font-semibold"
                        style={{ color: '#00843D' }}
                      >
                        {formatRupiah(result.adminFee)}
                      </span>
                    </div>
                  )}
                  {result.provisi > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: '#666666' }}>Provisi:</span>
                      <span
                        className="font-semibold"
                        style={{ color: '#00843D' }}
                      >
                        {formatRupiah(result.provisi)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: '#666666' }}>Sewa Modal:</span>
                    <span
                      className="font-semibold"
                      style={{ color: '#00843D' }}
                    >
                      {formatRupiah(result.sewaModal)}
                    </span>
                  </div>
                  <div
                    className="flex justify-between p-3 rounded font-bold text-lg"
                    style={{
                      backgroundColor: '#e8f5e9',
                      color: '#00843D',
                    }}
                  >
                    <span>Angsuran {pattern === 'REGULER' ? 'per Bulan:' : pattern === 'SEKALI_BAYAR' ? 'Total:' : 'per Periode:'}
                    </span>
                    <span>{formatRupiah(result.angsuran)}</span>
                  </div>
                </div>

                {/* Total Summary */}
                <div
                  className="p-4 rounded flex justify-between font-bold text-lg"
                  style={{
                    backgroundColor: '#c8e6c9',
                    color: '#00843D',
                  }}
                >
                  <span>Total yang Dibayarkan:</span>
                  <span>{formatRupiah(result.total)}</span>
                </div>

                {result.details && (
                  <p
                    className="mt-3 text-sm"
                    style={{ color: '#666666' }}
                  >
                    {result.details}
                  </p>
                )}
              </Card>
            )}

            {!result && (
              <Card
                className="border-dashed border-2 p-8 text-center"
                style={{
                  backgroundColor: '#e8f5e9',
                  borderColor: '#c8e6c9',
                }}
              >
                <p style={{ color: '#00843D' }}>
                  Isi form di samping dan klik &quot;Simulasikan&quot;
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
