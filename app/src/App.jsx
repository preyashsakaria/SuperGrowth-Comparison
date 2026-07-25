import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import InputPanel from './components/InputPanel';
import FundSelector from './components/FundSelector';
import ProjectionChart from './components/ProjectionChart';
import { calculateProjection } from './utils/calculator';
import { fundsData } from './data/funds';

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('sg-theme') || 'system';
    } catch {
      return 'system';
    }
  });
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    }
    try {
      localStorage.setItem('sg-theme', theme);
    } catch {
      // localStorage not available
    }
  }, [theme]);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const root = document.documentElement;
      if (e.matches) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
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
  const firstFund = fundsData[firstProvider] && fundsData[firstProvider].length > 0
    ? fundsData[firstProvider][0]
    : { name: 'Custom', return1y: 0 };
  
  const [allocations, setAllocations] = useState([
    { fundName: firstFund.name, fundRate: firstFund.return1y || 0, percentage: 100 }
  ]);

  const results = useMemo(() => {
    return calculateProjection({
      ...inputs,
      allocations
    });
  }, [inputs, allocations]);

  return (
    <>
      <header className="header">
        <h1 className="header-title">
          <span className="header-icon">🚀</span>
          SuperGrowth Dashboard
        </h1>
        
        <div className="toggle-group theme-toggle">
          <button 
            className={`toggle-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Light Mode"
            aria-label="Light Mode"
          >
            <Sun size={16} />
          </button>
          <button 
            className={`toggle-btn ${theme === 'system' ? 'active' : ''}`}
            onClick={() => setTheme('system')}
            title="System Default"
            aria-label="System Default"
          >
            <Monitor size={16} />
          </button>
          <button 
            className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Dark Mode"
            aria-label="Dark Mode"
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

      <footer className="footer">
        <p>SuperGrowth Dashboard &copy; {new Date().getFullYear()} &mdash; For educational purposes only. Not financial advice.</p>
      </footer>
    </>
  );
}

export default App;
