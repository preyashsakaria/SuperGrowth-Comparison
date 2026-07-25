const fs = require('fs');

const hostplusFile = 'Hostplus investment returns Superannuation 2025-07-25-2026-07-25.csv';
const lines = fs.readFileSync(hostplusFile, 'utf-8').trim().split('\n');

const headers = lines[1].split(',').map(h => h.trim());
let totals = Array(headers.length).fill(1.0);

// Data is from line 3 (index 3) to 14 (index 14) inclusive
for (let i = 3; i <= 14; i++) {
    const row = lines[i].split(',');
    for (let j = 1; j < headers.length; j++) {
        let val = row[j].trim().replace('%', '');
        if (val) {
            totals[j] *= (1 + parseFloat(val) / 100);
        }
    }
}

console.log("\n--- Hostplus 1-Year Returns ---");
for (let j = 1; j < headers.length; j++) {
    let returnPct = ((totals[j] - 1) * 100).toFixed(2);
    console.log(`${headers[j]}: ${returnPct}%`);
}
