import React from 'react';

const InputPanel = ({ inputs, setInputs }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-panel">
      <h2>Financial Details</h2>
      
      <div className="input-group">
        <label>Current Super Balance ($)</label>
        <input 
          type="number" 
          className="input-field" 
          name="initialBalance"
          value={inputs.initialBalance}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label>Annual Salary Before Tax ($)</label>
        <input 
          type="number" 
          className="input-field" 
          name="annualSalary"
          value={inputs.annualSalary}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label>Super Guarantee Rate (%)</label>
        <input 
          type="number" 
          step="0.1"
          className="input-field" 
          name="sgRate"
          value={inputs.sgRate}
          onChange={handleChange}
        />
      </div>

      <h3 style={{marginTop: '1.5rem', fontSize: '1.1rem'}}>Extra Contributions</h3>
      
      <div className="input-group">
        <label>Amount ($)</label>
        <input 
          type="number" 
          className="input-field" 
          name="extraContribution"
          value={inputs.extraContribution}
          onChange={handleChange}
        />
      </div>

      <div className="row-group">
        <div className="input-group">
          <label>Frequency</label>
          <select 
            className="input-field" 
            name="contributionFrequency"
            value={inputs.contributionFrequency}
            onChange={handleChange}
          >
            <option>Weekly</option>
            <option>Fortnightly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
        
        <div className="input-group">
          <label>Tax Treatment</label>
          <div className="toggle-group" style={{height: '46px', display: 'flex', alignItems: 'center'}}>
            <button 
              className={`toggle-btn ${inputs.contributionTaxType === 'before-tax' ? 'active' : ''}`}
              onClick={() => handleToggle('contributionTaxType', 'before-tax')}
            >
              Before Tax (15%)
            </button>
            <button 
              className={`toggle-btn ${inputs.contributionTaxType === 'after-tax' ? 'active' : ''}`}
              onClick={() => handleToggle('contributionTaxType', 'after-tax')}
            >
              After Tax (0%)
            </button>
          </div>
        </div>
      </div>

      <h3 style={{marginTop: '1.5rem', fontSize: '1.1rem'}}>Fees</h3>
      <div className="row-group">
        <div className="input-group">
          <label>Fixed Admin Fee ($/month)</label>
          <input 
            type="number" 
            step="0.5"
            className="input-field" 
            name="monthlyFixedFee"
            value={inputs.monthlyFixedFee}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>Investment/Admin Fee (%)</label>
          <input 
            type="number" 
            step="0.01"
            className="input-field" 
            name="percentageFee"
            value={inputs.percentageFee}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="input-group" style={{marginTop: '1rem'}}>
        <label>Projection Period (Years)</label>
        <div className="slider-container">
          <input 
            type="range" 
            min="1" max="40" 
            className="slider"
            name="yearsToProject"
            value={inputs.yearsToProject}
            onChange={handleChange}
          />
          <span style={{width: '30px', textAlign: 'right'}}>{inputs.yearsToProject}</span>
        </div>
      </div>

      <h3 style={{marginTop: '1.5rem', fontSize: '1.1rem'}}>Historical Baseline</h3>
      <div className="input-group">
        <label>Forecast Based On</label>
        <div className="toggle-group" style={{height: '46px', display: 'flex', alignItems: 'center'}}>
          <button 
            className={`toggle-btn ${inputs.forecastBaseline === '1y' ? 'active' : ''}`}
            onClick={() => handleToggle('forecastBaseline', '1y')}
          >
            1-Year (FY26)
          </button>
          <button 
            className={`toggle-btn ${inputs.forecastBaseline === '5y' ? 'active' : ''}`}
            onClick={() => handleToggle('forecastBaseline', '5y')}
          >
            5-Year Avg
          </button>
          <button 
            className={`toggle-btn ${inputs.forecastBaseline === '10y' ? 'active' : ''}`}
            onClick={() => handleToggle('forecastBaseline', '10y')}
          >
            10-Year Avg
          </button>
        </div>
        <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>
          Note: If 5-year or 10-year data is unavailable for a fund, it will default to 0%.
        </p>
      </div>
      <h3 style={{marginTop: '1.5rem', fontSize: '1.1rem'}}>Inflation (Real Return)</h3>
      <div className="row-group">
        <div className="input-group">
          <label>Adjust for Inflation?</label>
          <div className="toggle-group" style={{height: '46px', display: 'flex', alignItems: 'center'}}>
            <button 
              className={`toggle-btn ${inputs.adjustForInflation ? 'active' : ''}`}
              onClick={() => handleToggle('adjustForInflation', true)}
            >
              Yes
            </button>
            <button 
              className={`toggle-btn ${!inputs.adjustForInflation ? 'active' : ''}`}
              onClick={() => handleToggle('adjustForInflation', false)}
            >
              No
            </button>
          </div>
        </div>
        <div className="input-group">
          <label>Inflation Rate (%)</label>
          <input 
            type="number" 
            step="0.1"
            className="input-field" 
            name="inflationRate"
            value={inputs.inflationRate}
            onChange={handleChange}
            disabled={!inputs.adjustForInflation}
            style={{ opacity: inputs.adjustForInflation ? 1 : 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
