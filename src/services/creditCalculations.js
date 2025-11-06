export function calculateMonthlyPayment(amount, annualRate, months) {
  if (months === 0 || annualRate === 0) {
    return amount / months || 0
  }

  const monthlyRate = annualRate / 12 / 100
  
  const numerator = amount * monthlyRate * Math.pow(1 + monthlyRate, months)
  const denominator = Math.pow(1 + monthlyRate, months) - 1
  
  return numerator / denominator
}


export function calculateTotalCost(monthlyPayment, months, fees, amount, insuranceRate) {
  const insuranceTotal = amount * (insuranceRate / 100) * (months / 12)
  return (monthlyPayment * months) + fees + insuranceTotal
}


export function calculateAPR(amount, totalCost, months) {
  const totalInterest = totalCost - amount
  const annualInterestRate = (totalInterest / amount) * (12 / months) * 100
  return annualInterestRate
}


export function generateAmortizationTable(amount, monthlyPayment, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100
  const table = []
  let remaining = amount

  for (let month = 1; month <= months; month++) {
    const interest = remaining * monthlyRate
    
    const principal = monthlyPayment - interest
    
    remaining = remaining - principal
    
    table.push({
      month,
      interest: Math.round(interest * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      remaining: Math.max(0, Math.round(remaining * 100) / 100) 
    })
  }

  return table
}


export function validateSimulation(data, creditType) {
  const errors = []

  if (!data.amount || data.amount < creditType.minAmount) {
    errors.push(`Le montant minimum est de ${creditType.minAmount} MAD`)
  }

  if (!data.amount || data.amount > creditType.maxAmount) {
    errors.push(`Le montant maximum est de ${creditType.maxAmount} MAD`)
  }

  if (!data.months || data.months < 1) {
    errors.push('La durée doit être d\'au moins 1 mois')
  }

  if (!data.months || data.months > creditType.maxMonths) {
    errors.push(`La durée maximale est de ${creditType.maxMonths} mois`)
  }

  if (!data.annualRate || data.annualRate < 0) {
    errors.push('Le taux annuel doit être positif')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

