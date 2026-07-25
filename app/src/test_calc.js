import { calculateProjection } from './utils/calculator.js';

const inputs = {
  initialBalance: 50000,
  annualSalary: 0,
  sgRate: 11.5,
  extraContribution: 0,
  monthlyFixedFee: 0,
  percentageFee: 0,
  yearsToProject: 1,
  adjustForInflation: false,
  inflationRate: 2.5,
};

const allocations = [
  { fundRate: 10, percentage: 100 }
];

const result = calculateProjection({ ...inputs, allocations });
console.log(JSON.stringify(result.data, null, 2));
