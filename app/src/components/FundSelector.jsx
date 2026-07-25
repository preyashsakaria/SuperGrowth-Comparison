import React, { useEffect, useState } from 'react';
import { fundsData } from '../data/funds';

const FundSelector = ({ allocations, setAllocations, forecastBaseline = '1y' }) => {
  const companies = Object.keys(fundsData);
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);

  const getFundRate = (fundObj, baseline) => {
    if (!fundObj) return 0;
    if (baseline === '10y') return fundObj.return10y ?? fundObj.return5y ?? fundObj.return1y ?? 0;
    if (baseline === '5y') return fundObj.return5y ?? fundObj.return1y ?? 0;
    return fundObj.return1y ?? 0;
  };

  // When company changes, reset allocations to 100% in the first available fund
  useEffect(() => {
    const firstFund = fundsData[selectedCompany] && fundsData[selectedCompany].length > 0 ? fundsData[selectedCompany][0] : null;
    if (firstFund) {
      setAllocations([{ 
        fundName: firstFund.name, 
        fundRate: getFundRate(firstFund, forecastBaseline), 
        percentage: 100 
      }]);
    }
  }, [selectedCompany, forecastBaseline]);

  // When baseline changes, update the rates of currently selected funds
  useEffect(() => {
    setAllocations(prev => prev.map(alloc => {
      const fundObj = fundsData[selectedCompany].find(f => f.name === alloc.fundName);
      return {
        ...alloc,
        fundRate: getFundRate(fundObj, forecastBaseline)
      };
    }));
  }, [forecastBaseline, selectedCompany]);

  const totalAllocated = allocations.reduce((sum, alloc) => sum + parseFloat(alloc.percentage || 0), 0);

  const handleAddFund = () => {
    const firstFund = fundsData[selectedCompany] && fundsData[selectedCompany].length > 0 ? fundsData[selectedCompany][0] : null;
    if (allocations.length < 5 && firstFund) {
      setAllocations([...allocations, { 
        fundName: firstFund.name, 
        fundRate: getFundRate(firstFund, forecastBaseline), 
        percentage: 0 
      }]);
    }
  };

  const handleRemoveFund = (index) => {
    const newAlloc = [...allocations];
    newAlloc.splice(index, 1);
    setAllocations(newAlloc);
  };

  const updateAllocation = (index, field, value) => {
    const newAlloc = [...allocations];
    newAlloc[index][field] = value;
    
    // Auto-update rate if fund name changes
    if (field === 'fundName') {
      const fundObj = fundsData[selectedCompany].find(f => f.name === value);
      if (fundObj) {
        newAlloc[index].fundRate = getFundRate(fundObj, forecastBaseline);
      }
    }
    
    setAllocations(newAlloc);
  };

  return (
    <div className="glass-panel">
      <h2>Investment Portfolio</h2>
      
      <div className="input-group">
        <label>Superannuation Provider</label>
        <select 
          className="input-field" 
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            Fund Allocations
          </label>
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: 'bold',
            color: totalAllocated === 100 ? 'var(--accent-color)' : 'var(--danger-color)'
          }}>
            Total: {totalAllocated}%
          </span>
        </div>
      </div>

      {allocations.map((alloc, idx) => (
        <div key={idx} style={{ 
          background: 'rgba(0,0,0,0.02)', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <select 
                className="input-field"
                value={alloc.fundName}
                onChange={(e) => updateAllocation(idx, 'fundName', e.target.value)}
              >
                {fundsData[selectedCompany].map(fund => {
                  const rate = getFundRate(fund, forecastBaseline);
                  return (
                    <option key={fund.name} value={fund.name}>
                      {fund.name} ({forecastBaseline}: {rate !== 0 ? `${rate}%` : 'N/A'})
                    </option>
                  );
                })}
              </select>
            </div>
            {allocations.length > 1 && (
              <button 
                onClick={() => handleRemoveFund(idx)}
                className="btn-outline"
                style={{ padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--danger-color)', color: 'var(--danger-color)', background: 'transparent' }}
              >
                X
              </button>
            )}
          </div>
          
          <div className="slider-container">
            <span style={{ fontSize: '0.875rem', width: '60px' }}>Rate: {alloc.fundRate}%</span>
            <input 
              type="range" 
              min="0" max="100" 
              className="slider"
              value={alloc.percentage}
              onChange={(e) => updateAllocation(idx, 'percentage', e.target.value)}
            />
            <input 
              type="number" 
              className="input-field"
              style={{ width: '70px', padding: '0.5rem' }}
              value={alloc.percentage}
              onChange={(e) => updateAllocation(idx, 'percentage', e.target.value)}
            />
            <span style={{ fontSize: '0.875rem' }}>%</span>
          </div>
        </div>
      ))}

      {allocations.length < 5 && (
        <button className="btn btn-outline" onClick={handleAddFund} style={{ width: '100%', justifyContent: 'center' }}>
          + Add Another Fund
        </button>
      )}
      
      {totalAllocated !== 100 && (
        <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
          Warning: Allocations should add up to exactly 100% for accurate projections.
        </p>
      )}
    </div>
  );
};

export default FundSelector;
