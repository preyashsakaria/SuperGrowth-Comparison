import React, { useEffect } from 'react';
import { fundsData } from '../data/funds';

const FundSelector = ({ portfolios, setPortfolios, forecastBaseline = '1y' }) => {
  const companies = Object.keys(fundsData);

  const getFundRate = (fundObj, baseline) => {
    if (!fundObj) return 0;
    if (baseline === '10y') return fundObj.return10y ?? fundObj.return5y ?? fundObj.return1y ?? 0;
    if (baseline === '5y') return fundObj.return5y ?? fundObj.return1y ?? 0;
    return fundObj.return1y ?? 0;
  };

  // When baseline changes, update the rates of all funds in all portfolios
  useEffect(() => {
    setPortfolios(prev => prev.map(portfolio => ({
      ...portfolio,
      allocations: portfolio.allocations.map(alloc => {
        const fundObj = fundsData[alloc.provider]?.find(f => f.name === alloc.fundName);
        return {
          ...alloc,
          fundRate: getFundRate(fundObj, forecastBaseline)
        };
      })
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecastBaseline]); 
  // Omit setPortfolios from deps to prevent infinite loops if other state changes cause it to recreate

  const handleAddPortfolio = () => {
    if (portfolios.length >= 3) return; // Max 3 portfolios to avoid chart clutter
    const firstProvider = companies[0];
    const firstFund = fundsData[firstProvider][0];
    const newId = Math.max(0, ...portfolios.map(p => p.id)) + 1;
    setPortfolios([...portfolios, {
      id: newId,
      name: `Portfolio ${newId}`,
      allocations: [
        { provider: firstProvider, fundName: firstFund.name, fundRate: getFundRate(firstFund, forecastBaseline), percentage: 100 }
      ]
    }]);
  };

  const handleRemovePortfolio = (portfolioId) => {
    if (portfolios.length <= 1) return;
    setPortfolios(portfolios.filter(p => p.id !== portfolioId));
  };

  const handleAddFund = (portfolioId) => {
    setPortfolios(portfolios.map(p => {
      if (p.id !== portfolioId) return p;
      if (p.allocations.length >= 5) return p;
      const firstProvider = companies[0];
      const firstFund = fundsData[firstProvider][0];
      return {
        ...p,
        allocations: [...p.allocations, { provider: firstProvider, fundName: firstFund.name, fundRate: getFundRate(firstFund, forecastBaseline), percentage: 0 }]
      };
    }));
  };

  const handleRemoveFund = (portfolioId, allocIndex) => {
    setPortfolios(portfolios.map(p => {
      if (p.id !== portfolioId) return p;
      const newAlloc = [...p.allocations];
      newAlloc.splice(allocIndex, 1);
      return { ...p, allocations: newAlloc };
    }));
  };

  const updateAllocation = (portfolioId, allocIndex, field, value) => {
    setPortfolios(portfolios.map(p => {
      if (p.id !== portfolioId) return p;
      const newAlloc = [...p.allocations];
      const currentAlloc = { ...newAlloc[allocIndex] };
      
      if (field === 'provider') {
        currentAlloc.provider = value;
        const firstFund = fundsData[value][0];
        currentAlloc.fundName = firstFund.name;
        currentAlloc.fundRate = getFundRate(firstFund, forecastBaseline);
      } else if (field === 'fundName') {
        currentAlloc.fundName = value;
        const fundObj = fundsData[currentAlloc.provider].find(f => f.name === value);
        currentAlloc.fundRate = getFundRate(fundObj, forecastBaseline);
      } else if (field === 'percentage') {
        currentAlloc.percentage = value;
      }
      
      newAlloc[allocIndex] = currentAlloc;
      return { ...p, allocations: newAlloc };
    }));
  };

  const updatePortfolioName = (portfolioId, newName) => {
    setPortfolios(portfolios.map(p => 
      p.id === portfolioId ? { ...p, name: newName } : p
    ));
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: 0 }}>Portfolios</h2>
        {portfolios.length < 3 && (
          <button className="btn btn-outline" onClick={handleAddPortfolio} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            + Compare New
          </button>
        )}
      </div>

      {portfolios.map((portfolio) => {
        const totalAllocated = portfolio.allocations.reduce((sum, alloc) => sum + parseFloat(alloc.percentage || 0), 0);
        
        return (
          <div key={portfolio.id} style={{ 
            background: 'var(--panel-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <input 
                type="text" 
                value={portfolio.name} 
                onChange={(e) => updatePortfolioName(portfolio.id, e.target.value)}
                className="input-field"
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  borderBottom: '1px solid var(--border-color)', 
                  borderRadius: 0, 
                  padding: '0.25rem 0',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--accent-color)',
                  width: '60%'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold',
                  color: totalAllocated === 100 ? 'var(--success-color)' : 'var(--danger-color)'
                }}>
                  {totalAllocated}%
                </span>
                {portfolios.length > 1 && (
                  <button 
                    onClick={() => handleRemovePortfolio(portfolio.id)}
                    className="btn-outline"
                    title="Remove Portfolio"
                    style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', border: 'none', color: 'var(--text-muted)' }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>

            {portfolio.allocations.map((alloc, idx) => (
              <div key={idx} style={{ 
                background: 'rgba(0,0,0,0.02)', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid var(--border-color)'
              }}>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <select 
                      className="input-field"
                      value={alloc.provider}
                      onChange={(e) => updateAllocation(portfolio.id, idx, 'provider', e.target.value)}
                      style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                    >
                      {companies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {portfolio.allocations.length > 1 && (
                    <button 
                      onClick={() => handleRemoveFund(portfolio.id, idx)}
                      className="btn-outline"
                      title="Remove Fund"
                      style={{ padding: '0 0.5rem', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--danger-color)', color: 'var(--danger-color)', background: 'transparent' }}
                    >
                      X
                    </button>
                  )}
                </div>

                <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <select 
                    className="input-field"
                    value={alloc.fundName}
                    onChange={(e) => updateAllocation(portfolio.id, idx, 'fundName', e.target.value)}
                  >
                    {fundsData[alloc.provider]?.map(fund => {
                      const rate = getFundRate(fund, forecastBaseline);
                      return (
                        <option key={fund.name} value={fund.name}>
                          {fund.name} ({forecastBaseline}: {rate !== 0 ? `${rate}%` : 'N/A'})
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <div className="slider-container">
                  <span style={{ fontSize: '0.8rem', minWidth: '45px' }}>{alloc.fundRate}%</span>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    className="slider"
                    value={alloc.percentage}
                    onChange={(e) => updateAllocation(portfolio.id, idx, 'percentage', e.target.value)}
                  />
                  <input 
                    type="number" 
                    className="input-field"
                    style={{ width: '60px', padding: '0.4rem', fontSize: '0.9rem' }}
                    value={alloc.percentage}
                    onChange={(e) => updateAllocation(portfolio.id, idx, 'percentage', e.target.value)}
                  />
                  <span style={{ fontSize: '0.875rem' }}>%</span>
                </div>
              </div>
            ))}

            {portfolio.allocations.length < 5 && (
              <button className="btn-outline" onClick={() => handleAddFund(portfolio.id)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', border: '1px dashed var(--border-color)', background: 'transparent', color: 'var(--text-muted)' }}>
                + Add Fund to {portfolio.name}
              </button>
            )}
            
            {totalAllocated !== 100 && (
              <p style={{ color: 'var(--danger-color)', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
                Must equal 100%
              </p>
            )}
          </div>
        );
      })}

    </div>
  );
};

export default FundSelector;
