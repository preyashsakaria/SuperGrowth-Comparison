import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import InputPanel from './components/InputPanel';
import FundSelector from './components/FundSelector';
import ProjectionChart from './components/ProjectionChart';
import { calculateProjection } from './utils/calculator';
import { fundsData } from './data/funds';

function App() {
  const [theme, setTheme] = useState('system');
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      // System
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    }
  }, [theme]);

  const [inputs, setInputs] = useState({
    initialBalance: 50000,
    annualSalary: 80000,
    sgRate: 11.5,
    extraContribution: 100,
    contributionFrequency: 'Monthly',
    contributionTaxType: 'before-tax',
    monthlyFixedFee: 6.50,
    percentageFee: 0.15,
    yearsToProject: 10,
    forecastBaseline: '1y',
    adjustForInflation: true,
    inflationRate: 2.5,
  });

  const firstProvider = Object.keys(fundsData)[0];
  const firstFund = fundsData[firstProvider] && fundsData[firstProvider].length > 0 ? fundsData[firstProvider][0] : { name: 'Custom', return1y: 0 };
  
  const [allocations, setAllocations] = useState([
    { fundName: firstFund.name, fundRate: firstFund.return1y || 0, percentage: 100 }
  ]);

  const [results, setResults] = useState(null);

  useEffect(() => {
    const projection = calculateProjection({
      ...inputs,
      allocations
    });
    setResults(projection);
  }, [inputs, allocations]);

  return (
    <>
      <header className="header">
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>🚀</span>
          SuperGrowth Dashboard
        </h1>
        
        <div className="toggle-group" style={{ width: '150px' }}>
          <button 
            className={`toggle-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Light Mode"
          >
            <Sun size={16} />
          </button>
          <button 
            className={`toggle-btn ${theme === 'system' ? 'active' : ''}`}
            onClick={() => setTheme('system')}
            title="System Default"
          >
            <Monitor size={16} />
          </button>
          <button 
            className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Dark Mode"
          >
            <Moon size={16} />
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        <aside>
          <InputPanel inputs={inputs} setInputs={setInputs} />
          <FundSelector 
            allocations={allocations} 
            setAllocations={setAllocations} 
            forecastBaseline={inputs.forecastBaseline}
          />
        </aside>

        <main>
          {results && <ProjectionChart data={results.data} results={results} />}
        </main>
      </div>
    </>
  );
}

export default App;
