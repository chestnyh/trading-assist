// Sample K-line data (replace this with your actual data)
const kLineData = [
    { date: '2024-04-01', closePrice: 100 },
    { date: '2024-04-02', closePrice: 105 },
    { date: '2024-04-03', closePrice: 110 },
    { date: '2024-04-04', closePrice: 108 },
    { date: '2024-04-05', closePrice: 115 }
];
/**
 * This JavaScript code calculates a 3-day simple moving average (SMA) for the provided sample K-line data. 
 * You can replace kLineData with your actual data. The calculateSMA function takes an array of data and a window size (in this case, 3 days) and returns an array of SMA values.

This example assumes that the input data is an array of objects with date and closePrice properties for each K-line data point. Adjust the windowSize variable to calculate different SMA periods, such as a 5-day SMA or a 10-day SMA.
 * @param {*} data 
 * @param {*} window 
 * @returns 
 */

// Function to calculate SMA
function calculateSMA(data, window) {
    const smaValues = [];
    for (let i = 0; i < data.length; i++) {
        if (i >= window - 1) {
            let sum = 0;
            for (let j = i; j > i - window; j--) {
                sum += data[j].closePrice;
            }
            const sma = sum / window;
            smaValues.push({ date: data[i].date, sma });
        } else {
            smaValues.push({ date: data[i].date, sma: null });
        }
    }
    return smaValues;
}

// Calculate 3-day SMA
const windowSize = 3;
const smaValues = calculateSMA(kLineData, windowSize);

// Print SMA values
smaValues.forEach(item => {
    console.log(`Date: ${item.date}, SMA: ${item.sma}`);
});