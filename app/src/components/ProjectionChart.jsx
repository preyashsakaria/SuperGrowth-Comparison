import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-color)',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Year {label}</p>
        <p style={{ margin: 0, color: 'var(--accent-color)' }}>
          Balance: ${payload[0].value.toLocaleString()}
        </p>
        {payload[1] && (
          <p style={{ margin: 0, color: '#8b5cf6', fontSize: '0.875rem' }}>
            Contributions: ${payload[1].value.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const ProjectionChart = ({ data, results }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2>Projection Results</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Estimated growth over {data[data.length - 1].year} years at {results.blendedRate}% p.a.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ margin: 0, padding: '1rem' }}>
          <div className="stat-label">Final Balance</div>
          <div className="stat-value">${results.finalBalance.toLocaleString()}</div>
        </div>
        <div className="stat-card glass-panel" style={{ margin: 0, padding: '1rem' }}>
          <div className="stat-label">Total Contributions</div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>${results.totalContributions.toLocaleString()}</div>
        </div>
        <div className="stat-card glass-panel" style={{ margin: 0, padding: '1rem' }}>
          <div className="stat-label">Total Fees Paid</div>
          <div className="stat-value" style={{ color: 'var(--danger-color)' }}>${results.totalFees.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-line)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--chart-line)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="var(--text-muted)"
              tickFormatter={(value) => `Yr ${value}`}
            />
            <YAxis 
              stroke="var(--text-muted)"
              tickFormatter={(value) => `$${(value / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Area 
              type="monotone" 
              dataKey="balance" 
              name="Total Balance"
              stroke="var(--chart-line)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
            <Area 
              type="monotone" 
              dataKey="contributions" 
              name="Total Contributions"
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorContrib)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectionChart;
