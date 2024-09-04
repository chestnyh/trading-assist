// Sample K-line data (replace this with your actual data)
const kLineData = [
    { date: '2024-04-01', closePrice: 100 },
    { date: '2024-04-02', closePrice: 105 },
    { date: '2024-04-03', closePrice: 110 },
    { date: '2024-04-04', closePrice: 108 },
    { date: '2024-04-05', closePrice: 115 }
];

/**
 * This code calculates a trendline using linear regression for the provided sample K-line data. 
 * You can replace kLineData with your actual data. 
 * The calculateTrendline function takes an array of data points and returns the slope and intercept of the trendline equation.
 * 
  The trendline equation is printed to the console in the form of y = mx + b, where m is the slope and b is the intercept. This equation represents the trendline that best fits the given data points.
 * @param {*} data 
 * @returns 
 */
// Function to calculate trendline using linear regression
function calculateTrendline(data) {
    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
        const x = i + 1; // index + 1 as x
        const y = data[i].closePrice;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

// Calculate trendline
const { slope, intercept } = calculateTrendline(kLineData);

// Print trendline equation
console.log(`Trendline Equation: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`);