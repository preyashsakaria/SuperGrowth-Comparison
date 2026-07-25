const xlsx = require('xlsx');

const cbusFile = "cbus investment_performance.xlsx";
const ausSuperFile = "Australian_Super_Investment_Option_Performance_2026.xlsx";

function printFile(file) {
    const wb = xlsx.readFile(file);
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_csv(ws);
    console.log(`\n\n--- ${file} ---`);
    console.log(data.split('\n').slice(0, 30).join('\n'));
}

try {
    printFile(cbusFile);
    printFile(ausSuperFile);
} catch (e) {
    console.error("Error reading files:", e);
}
