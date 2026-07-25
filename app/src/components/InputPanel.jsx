import React from 'react';

const InputPanel = ({ inputs, setInputs }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Format number with commas for display
  const monthlyEmployerContrib = ((parseFloat(inputs.annualSalary) || 0) * (parseFloat(inputs.sgRate) / 100) / 12).toFixed(0);

  return (
    <div className="glass-panel">
      <h2>Financial Details</h2>
      
      <div className="input-group">
        <label htmlFor="initialBalance">Current Super Balance ($)</label>
        <input 
          id="initialBalance"
          type="number" 
          className="input-field" 
          name="initialBalance"
          value={inputs.initialBalance}
          onChange={handleChange}
          min="0"
          placeholder="e.g. 50000"
        />
      </div>

      <div className="input-group">
        <label htmlFor="annualSalary">Annual Salary Before Tax ($)</label>
        <input 
          id="annualSalary"
          type="number" 
          className="input-field" 
          name="annualSalary"
          value={inputs.annualSalary}
          onChange={handleChange}
          min="0"
          placeholder="e.g. 80000"
        />
      </div>

      <div className="input-group">
        <label htmlFor="sgRate">Super Guarantee Rate (%)</label>
        <input 
          id="sgRate"
          type="number" 
          step="0.5"
          className="input-field" 
          name="sgRate"
          value={inputs.sgRate}
          onChange={handleChange}
          min="0"
          max="30"
        />
        <span className="input-hint">
          Employer contributes ~${parseInt(monthlyEmployerContrib).toLocaleString()}/month before tax
        </span>
      </div>

      <div className="section-divider" />
      <h3 className="section-heading">Extra Contributions</h3>
      
      <div className="input-group">
        <label htmlFor="extraContribution">Amount ($)</label>
        <input 
          id="extraContribution"
          type="number" 
          className="input-field" 
          name="extraContribution"
          value={inputs.extraContribution}
          onChange={handleChange}
          min="0"
          placeholder="e.g. 100"
        />
      </div>

      <div className="row-group">
        <div className="input-group">
          <label htmlFor="contributionFrequency">Frequency</label>
          <select 
            id="contributionFrequency"
            className="input-field" 
            name="contributionFrequency"
            value={inputs.contributionFrequency}
            onChange={handleChange}
          >
            <option value="Weekly">Weekly</option>
            <option value="Fortnightly">Fortnightly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
        
        <div className="input-group">
          <label>Tax Treatment</label>
          <div className="toggle-group" style={{height: '46px', display: 'flex', alignItems: 'center'}}>
            <button 
              type="button"
              className={`toggle-btn ${inputs.contributionTaxType === 'before-tax' ? 'active' : ''}`}
              onClick={() => handleToggle('contributionTaxType', 'before-tax')}
            >
              Before Tax
            </button>
            <button 
              type="button"
              className={`toggle-btn ${inputs.contributionTaxType === 'after-tax' ? 'active' : ''}`}
              onClick={() => handleToggle('contributionTaxType', 'after-tax')}
            >
              After Tax
            </button>
          </div>
          <span className="input-hint">
            {inputs.contributionTaxType === 'before-tax' ? 'Taxed at 15% on entry' : 'No additional tax'}
          </span>
        </div>
      </div>

      <div className="section-divider" />
      <h3 className="section-heading">Fees</h3>
      <div className="row-group">
        <div className="input-group">
          <label htmlFor="monthlyFixedFee">Admin Fee ($/mo)</label>
          <input 
            id="monthlyFixedFee"
            type="number" 
            step="0.5"
            className="input-field" 
            name="monthlyFixedFee"
            value={inputs.monthlyFixedFee}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor="percentageFee">Invest. Fee (% p.a.)</label>
          <input 
            id="percentageFee"
            type="number" 
            step="0.01"
            className="input-field" 
            name="percentageFee"
            value={inputs.percentageFee}
            onChange={handleChange}
            min="0"
            max="5"
          />
        </div>
      </div>

      <div className="section-divider" />
      <div className="input-group">
        <label htmlFor="yearsSlider">Projection Period</label>
        <div className="slider-container">
          <input 
            id="yearsSlider"
            type="range" 
            min="1" max="40" 
            className="slider"
            name="yearsToProject"
            value={inputs.yearsToProject}
            onChange={handleChange}
          />
          <span className="slider-value">{inputs.yearsToProject} yrs</span>
        </div>
      </div>

      <div className="section-divider" />
      <h3 className="section-heading">Historical Baseline</h3>
      <div className="input-group">
        <label>Forecast Based On</label>
        <div className="toggle-group" style={{height: '46px', display: 'flex', alignItems: 'center'}}>
          <button 
            type="button"
            className={`toggle-btn ${inputs.forecastBaseline === '1y' ? 'active' : ''}`}
            onClick={() => handleToggle('forecastBaseline', '1y')}
          >
            1-Year
          </button>
          <button 
            type="button"
            className={`toggle-btn ${inputs.forecastBaseline === '5y' ? 'active' : ''}`}
            onClick={() => handleToggle('forecastBaseline', '5y')}
          >
            5-Year
          </button>
          <button 
            type="button"
            className={`toggle-btn ${inputs.forecastBaseline === '10y' ? 'active' : ''}`}
            onClick={() => handleToggle('forecastBaseline', '10y')}
          >
            10-Year
          </button>
        </div>
        <span className="input-hint">
          Uses historical average returns as the growth rate assumption
        </span>
      </div>

      <div className="section-divider" />
      <h3 className="section-heading">Inflation</h3>
      <div className="row-group">
        <div className="input-group">
          <label>Adjust for Inflation?</label>
          <div className="toggle-group" style={{height: '46px', display: 'flex', alignItems: 'center'}}>
            <button 
              type="button"
              className={`toggle-btn ${inputs.adjustForInflation ? 'active' : ''}`}
              onClick={() => handleToggle('adjustForInflation', true)}
            >
              Yes
            </button>
            <button 
              type="button"
              className={`toggle-btn ${!inputs.adjustForInflation ? 'active' : ''}`}
              onClick={() => handleToggle('adjustForInflation', false)}
            >
              No
            </button>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="inflationRate">Rate (% p.a.)</label>
          <input 
            id="inflationRate"
            type="number" 
            step="0.1"
            className="input-field" 
            name="inflationRate"
            value={inputs.inflationRate}
            onChange={handleChange}
            disabled={!inputs.adjustForInflation}
            style={{ opacity: inputs.adjustForInflation ? 1 : 0.4 }}
            min="0"
            max="20"
          />
          <span className="input-hint">
            {inputs.adjustForInflation ? 'Shows balance in today\'s dollars' : 'Showing nominal values'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
