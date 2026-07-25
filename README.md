# SuperGrowth Dashboard

SuperGrowth Dashboard is a comprehensive and interactive superannuation (Australian retirement fund) comparison and projection tool. It empowers users to visualize how their super balance will grow over time under different investment strategies, funds, and contribution settings.

## 🎯 Purpose

Choosing the right superannuation fund and investment option can make a massive difference to retirement outcomes. SuperGrowth Dashboard removes the guesswork by providing a highly customizable calculator that takes into account:
- Historical fund performance (1-year, 5-year, and 10-year average returns).
- Complex fee structures, including monthly fixed admin fees and percentage-based investment fees.
- Real-world economics, like inflation adjustments, to show the *real* purchasing power of future balances.
- Various contribution types (Employer Super Guarantee, Extra before-tax, and Extra after-tax contributions).

## ✨ Features

- **Fund Comparison Engine:** Select from a database of top Australian super funds (Rest, Hostplus, AustralianSuper, CareSuper, Aware Super, Cbus, etc.) and map out specific investment options.
- **Historical Baseline Projection:** Choose whether your future projections should be modeled on the fund's past 1-year, 5-year, or 10-year average returns.
- **Inflation Adjustment:** Toggle inflation on to instantly discount the projected growth rate and see your future balance in today's dollars.
- **Interactive Visualizations:** Beautiful, responsive area charts powered by Recharts that clearly delineate the money you contributed versus the compound interest earned.
- **Blended Allocations:** (Under development) Support for splitting your portfolio across multiple investment options (e.g., 70% High Growth, 30% Balanced) to see blended return rates.

## 🛠️ Technology Stack

- **Frontend:** React + Vite
- **Data Visualization:** Recharts
- **Styling:** Custom Vanilla CSS with a responsive, glassmorphic dark-theme UI.
- **Data Processing:** Node.js utilities for parsing raw provider data (Excel/CSV) into clean JSON structures.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/preyashsakaria/SuperGrowth-Comparison.git
   ```
2. Navigate to the `app` directory:
   ```bash
   cd SuperGrowth-Comparison/app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173/`
