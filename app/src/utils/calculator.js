export const calculateProjection = ({
  initialBalance,
  annualSalary,
  sgRate = 11.5, // 11.5% for FY25, goes to 12% in FY26
  extraContribution,
  contributionFrequency,
  contributionTaxType, // 'before-tax' or 'after-tax'
  monthlyFixedFee,
  percentageFee, // Annual percentage fee
  yearsToProject = 10,
  adjustForInflation,
  inflationRate,
  allocations, // Array of { fundRate, percentage } e.g., [{ fundRate: 9.81, percentage: 70 }, { fundRate: 5.0, percentage: 30 }]
}) => {
  const parsedYears = parseInt(yearsToProject, 10);
  const monthsToProject = (isNaN(parsedYears) || parsedYears <= 0 ? 1 : parsedYears) * 12;
  let currentBalance = parseFloat(initialBalance) || 0;
  
  const data = [{
    year: 0,
    balance: Math.round(currentBalance),
    contributions: 0
  }];
  
  // Calculate employer monthly contribution (assumes 15% tax on SG)
  const employerMonthlyContrib = (parseFloat(annualSalary || 0) * (parseFloat(sgRate) / 100)) / 12;
  const employerNetMonthly = employerMonthlyContrib * 0.85; // Less 15% tax
  
  // Calculate extra monthly contribution
  let extraMonthly = 0;
  let parsedExtra = parseFloat(extraContribution) || 0;
  if (contributionFrequency === 'Weekly') extraMonthly = parsedExtra * (52 / 12);
  else if (contributionFrequency === 'Fortnightly') extraMonthly = parsedExtra * (26 / 12);
  else if (contributionFrequency === 'Monthly') extraMonthly = parsedExtra;
  else if (contributionFrequency === 'Yearly') extraMonthly = parsedExtra / 12;

  // Apply tax if before-tax
  const netExtraMonthly = contributionTaxType === 'before-tax' ? extraMonthly * 0.85 : extraMonthly;

  // Calculate blended annual rate based on allocations
  let blendedAnnualRate = 0;
  if (allocations && allocations.length > 0) {
    let totalAlloc = 0;
    allocations.forEach(a => {
      blendedAnnualRate += (parseFloat(a.fundRate) || 0) * (parseFloat(a.percentage) / 100);
      totalAlloc += parseFloat(a.percentage);
    });
    // Fallback if allocations don't equal 100
    if (totalAlloc !== 100 && totalAlloc > 0) {
      blendedAnnualRate = blendedAnnualRate * (100 / totalAlloc);
    }
  }

  // Adjust for inflation (real return)
  if (adjustForInflation) {
    blendedAnnualRate -= (parseFloat(inflationRate) || 0);
  }

  // Convert blended annual rate to monthly effective rate: (1 + r)^(1/12) - 1
  const monthlyGrowthRate = Math.pow(1 + (blendedAnnualRate / 100), 1 / 12) - 1;
  const monthlyPercentFee = (parseFloat(percentageFee) || 0) / 100 / 12;
  
  // Calculate unique providers to multiply fixed admin fee
  const uniqueProviders = new Set(allocations?.map(a => a.provider).filter(Boolean)).size || 1;
  const fixedMonthly = (parseFloat(monthlyFixedFee) || 0) * uniqueProviders;

  // Track totals
  let totalContributions = 0;
  let totalFees = 0;


  for (let m = 1; m <= monthsToProject; m++) {
    // 1. Add Contributions
    currentBalance += employerNetMonthly + netExtraMonthly;
    totalContributions += employerNetMonthly + netExtraMonthly;
    
    // 2. Deduct fixed fee
    currentBalance -= fixedMonthly;
    totalFees += fixedMonthly;

    // 3. Apply growth
    currentBalance += currentBalance * monthlyGrowthRate;
    
    // 4. Deduct percentage fee
    const pctFeeAmount = currentBalance * monthlyPercentFee;
    currentBalance -= pctFeeAmount;
    totalFees += pctFeeAmount;

    if (m % 12 === 0) {
      data.push({
        month: m,
        year: m / 12,
        balance: Math.round(currentBalance),
        contributions: Math.round(totalContributions),
        fees: Math.round(totalFees)
      });
    }
  }

  return {
    data,
    finalBalance: Math.round(currentBalance),
    totalContributions: Math.round(totalContributions),
    totalFees: Math.round(totalFees),
    blendedRate: blendedAnnualRate.toFixed(2)
  };
};
