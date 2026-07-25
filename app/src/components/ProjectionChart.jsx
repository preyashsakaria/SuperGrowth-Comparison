import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const formatCurrency = (value) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const balance = payload.find(p => p.dataKey === 'balance');
    const contribs = payload.find(p => p.dataKey === 'contributions');
    const fees = payload.find(p => p.dataKey === 'fees');
    const compoundGrowth = balance && contribs
      ? balance.value - contribs.value - (fees ? fees.value : 0)
      : 0;

    return (
      <div className="chart-tooltip">
        <p className="tooltip-year">Year {label}</p>
        <div className="tooltip-row">
          <span className="tooltip-dot" style={{ background: 'var(--chart-line)' }} />
          <span>Balance</span>
          <strong>${balance?.value?.toLocaleString() ?? '0'}</strong>
        </div>
        {contribs && (
          <div className="tooltip-row">
            <span className="tooltip-dot" style={{ background: '#8b5cf6' }} />
            <span>Contributions</span>
            <strong>${contribs.value.toLocaleString()}</strong>
          </div>
        )}
        {compoundGrowth > 0 && (
          <div className="tooltip-row">
            <span className="tooltip-dot" style={{ background: '#10b981' }} />
            <span>Interest Earned</span>
            <strong>${Math.round(compoundGrowth).toLocaleString()}</strong>
          </div>
        )}
        {fees && fees.value > 0 && (
          <div className="tooltip-row">
            <span className="tooltip-dot" style={{ background: 'var(--danger-color)' }} />
            <span>Fees Paid</span>
            <strong>${fees.value.toLocaleString()}</strong>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const ProjectionChart = ({ data, results }) => {
  if (!data || data.length === 0) return null;

  const lastYear = data[data.length - 1];
  const interestEarned = results.finalBalance - results.totalContributions - (parseFloat(results.initialBalance) || data[0]?.balance || 0);

  // Calculate the percentage of balance that is compound growth
  const compoundPct = results.finalBalance > 0
    ? ((results.finalBalance - results.totalContributions) / results.finalBalance * 100).toFixed(1)
    : 0;

  return (
    <div className="glass-panel projection-panel">
      {/* Header */}
      <div className="projection-header">
        <div>
          <h2>Projection Results</h2>
          <p className="projection-subtitle">
            Estimated growth over <strong>{lastYear?.year ?? 0} years</strong> at <strong>{results.blendedRate}% p.a.</strong>
            {parseFloat(results.blendedRate) < 0 && (
              <span className="rate-warning"> (negative real return)</span>
            )}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-label">Final Balance</div>
          <div className="stat-value">${results.finalBalance.toLocaleString()}</div>
          <div className="stat-subtext">{compoundPct}% from growth</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-label">Total Contributions</div>
          <div className="stat-value stat-value-purple">${results.totalContributions.toLocaleString()}</div>
          <div className="stat-subtext">Employer + Extra</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-label">Total Fees Paid</div>
          <div className="stat-value stat-value-danger">${results.totalFees.toLocaleString()}</div>
          <div className="stat-subtext">
            {results.finalBalance > 0
              ? `${(results.totalFees / results.finalBalance * 100).toFixed(2)}% of balance`
              : '—'}
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-label">Compound Growth</div>
          <div className="stat-value stat-value-success">
            ${Math.max(0, Math.round(interestEarned > 0 ? interestEarned : 0)).toLocaleString()}
          </div>
          <div className="stat-subtext">Interest earned</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-line)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--chart-line)" stopOpacity={0.02}/>
              </linearGradient>
              <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="var(--text-muted)"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `Yr ${value}`}
            />
            <YAxis 
              stroke="var(--text-muted)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              formatter={(value) => <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{value}</span>}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              name="Total Balance"
              stroke="var(--chart-line)" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorBalance)"
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Area 
              type="monotone" 
              dataKey="contributions" 
              name="Total Contributions"
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorContrib)"
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly Breakdown Table */}
      {data.length > 2 && (
        <details className="breakdown-details">
          <summary className="breakdown-summary">
            📊 View Yearly Breakdown
          </summary>
          <div className="breakdown-table-wrapper">
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Contributions</th>
                  <th>Fees</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(d => d.year !== undefined && d.year > 0).map(row => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td className="td-balance">${row.balance.toLocaleString()}</td>
                    <td>${row.contributions.toLocaleString()}</td>
                    <td className="td-fees">${(row.fees || 0).toLocaleString()}</td>
                    <td className="td-growth">
                      ${Math.max(0, row.balance - row.contributions - (data[0]?.balance || 0)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
};

export default ProjectionChart;
