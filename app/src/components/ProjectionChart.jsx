import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const formatCurrency = (value) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
};

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // orange
  '#8b5cf6', // purple
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-year">Year {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-row">
            <span className="tooltip-dot" style={{ background: entry.color }} />
            <span>{entry.name}</span>
            <strong>${entry.value?.toLocaleString() ?? '0'}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ProjectionChart = ({ results }) => {
  const [activeTab, setActiveTab] = useState(0); // For switching stats view

  if (!results || results.length === 0) return null;

  // Combine data for Recharts
  // Ensure all result data arrays have the same length
  const maxYears = Math.max(...results.map(r => r.data.length));
  const combinedData = [];

  for (let i = 0; i < maxYears; i++) {
    const point = { year: results[0].data[i]?.year ?? i };
    results.forEach((r, idx) => {
      if (r.data[i]) {
        point[r.portfolioName || `Portfolio ${idx + 1}`] = r.data[i].balance;
      }
    });
    combinedData.push(point);
  }

  const activeResult = results[activeTab] || results[0];
  const interestEarned = activeResult.finalBalance - activeResult.totalContributions - (activeResult.data[0]?.balance || 0);
  const compoundPct = activeResult.finalBalance > 0
    ? ((activeResult.finalBalance - activeResult.totalContributions) / activeResult.finalBalance * 100).toFixed(1)
    : 0;

  return (
    <div className="glass-panel projection-panel">
      {/* Header */}
      <div className="projection-header">
        <div>
          <h2>Projection Results</h2>
          <p className="projection-subtitle">
            Comparing <strong>{results.length}</strong> portfolio{results.length > 1 ? 's' : ''} over <strong>{combinedData[combinedData.length - 1]?.year ?? 0} years</strong>.
          </p>
        </div>
      </div>

      {/* Stats Navigation if multiple portfolios */}
      {results.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {results.map((r, idx) => (
            <button
              key={idx}
              className={`btn-outline ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: activeTab === idx ? `1px solid ${COLORS[idx % COLORS.length]}` : '1px solid var(--border-color)',
                background: activeTab === idx ? `${COLORS[idx % COLORS.length]}15` : 'transparent',
                color: activeTab === idx ? COLORS[idx % COLORS.length] : 'var(--text-muted)',
                fontWeight: activeTab === idx ? '600' : 'normal',
                cursor: 'pointer'
              }}
            >
              {r.portfolioName || `Portfolio ${idx + 1}`} Stats
            </button>
          ))}
        </div>
      )}

      {/* Stats Grid for Active Portfolio */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ borderColor: `${COLORS[activeTab % COLORS.length]}40` }}>
          <div className="stat-label">Final Balance</div>
          <div className="stat-value" style={{ color: COLORS[activeTab % COLORS.length] }}>
            ${activeResult.finalBalance.toLocaleString()}
          </div>
          <div className="stat-subtext">{compoundPct}% from growth</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-label">Total Contributions</div>
          <div className="stat-value stat-value-purple">${activeResult.totalContributions.toLocaleString()}</div>
          <div className="stat-subtext">Employer + Extra</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-label">Total Fees Paid</div>
          <div className="stat-value stat-value-danger">${activeResult.totalFees.toLocaleString()}</div>
          <div className="stat-subtext">
            {activeResult.finalBalance > 0
              ? `${(activeResult.totalFees / activeResult.finalBalance * 100).toFixed(2)}% of balance`
              : '—'}
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-label">Compound Growth</div>
          <div className="stat-value stat-value-success">
            ${Math.max(0, Math.round(interestEarned > 0 ? interestEarned : 0)).toLocaleString()}
          </div>
          <div className="stat-subtext">Interest earned ({activeResult.blendedRate}% p.a.)</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
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
              formatter={(value) => <span style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{value}</span>}
            />
            {results.map((r, idx) => (
              <Line 
                key={idx}
                type="monotone" 
                dataKey={r.portfolioName || `Portfolio ${idx + 1}`}
                stroke={COLORS[idx % COLORS.length]} 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly Breakdown Table */}
      {activeResult.data.length > 2 && (
        <details className="breakdown-details">
          <summary className="breakdown-summary">
            📊 View Yearly Breakdown ({activeResult.portfolioName || `Portfolio ${activeTab + 1}`})
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
                {activeResult.data.filter(d => d.year !== undefined && d.year > 0).map(row => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td className="td-balance">${row.balance.toLocaleString()}</td>
                    <td>${row.contributions.toLocaleString()}</td>
                    <td className="td-fees">${(row.fees || 0).toLocaleString()}</td>
                    <td className="td-growth">
                      ${Math.max(0, row.balance - row.contributions - (activeResult.data[0]?.balance || 0)).toLocaleString()}
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
