// Import simple-statistics library
const ss = require('simple-statistics');

// Sample K-line data (replace this with your actual data)
const kLineData = [
    { date: '2024-04-01', closePrice: 100 },
    { date: '2024-04-02', closePrice: 105 },
    { date: '2024-04-03', closePrice: 110 },
    { date: '2024-04-04', closePrice: 108 },
    { date: '2024-04-05', closePrice: 115 }
];

/**
 * This code calculates a simple linear regression for the provided sample K-line data using the simple-statistics library. It extracts the x-values (which can be indices or any other independent variable) and y-values (dependent variable) from the data, performs linear regression, and then prints out the equation of the regression line.

Remember, for more complex regression analyses or if you have specific requirements, you might need to use more advanced libraries or even implement the algorithms yourself.
 */
// Extract x (independent variable) and y (dependent variable) from the data
const xValues = kLineData.map((item, index) => index + 1); // Using index as x values
const yValues = kLineData.map(item => item.closePrice);

// Perform simple linear regression
const regressionLine = ss.linearRegression([xValues, yValues]);

// Calculate the slope and intercept
const slope = regressionLine.m;
const intercept = regressionLine.b;

// Print the regression equation
console.log(`Regression Equation: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`);