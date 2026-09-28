export const formatINR = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export function calculateFD({ principal, rate, years, frequency }) {
  const final = principal * (1 + rate / 100 / frequency) ** (frequency * years);
  return { invested: principal, growth: final - principal, final };
}

export function annuityFactor(monthlyRate, months) {
  return monthlyRate === 0 ? months : Math.expm1(months * Math.log1p(monthlyRate)) / monthlyRate * (1 + monthlyRate);
}

export function calculateSIP({ monthly, rate, years, initial = 0 }) {
  const months = Math.round(years * 12);
  const monthlyRate = rate / 100 / 12;
  const final = monthly * annuityFactor(monthlyRate, months) + initial * (1 + monthlyRate) ** months;
  const invested = monthly * months + initial;
  return { invested, growth: final - invested, final };
}

export function calculateGoal({ cost, years, inflation, savings, rate }) {
  const months = Math.round(years * 12);
  const monthlyRate = rate / 100 / 12;
  const futureCost = cost * (1 + inflation / 100) ** years;
  const projectedSavings = savings * (1 + monthlyRate) ** months;
  const gap = Math.max(0, futureCost - projectedSavings);
  const monthlyRequired = gap / annuityFactor(monthlyRate, months);
  const oneTime = gap / (1 + monthlyRate) ** months;
  return { futureCost, projectedSavings, monthlyRequired, oneTime, progress: Math.min(100, savings / futureCost * 100), projectedProgress: Math.min(100, projectedSavings / futureCost * 100), invested: Math.min(projectedSavings, futureCost), growth: gap, final: futureCost };
}
