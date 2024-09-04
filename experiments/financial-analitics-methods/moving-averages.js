// Sample K-line data (replace this with your actual data)
const kLineData = [
    { date: '2024-04-01', closePrice: 100 },
    { date: '2024-04-02', closePrice: 105 },
    { date: '2024-04-03', closePrice: 110 },
    { date: '2024-04-04', closePrice: 108 },
    { date: '2024-04-05', closePrice: 115 }
];
/**
 * This code calculates a 3-day simple moving average (SMA) for the provided 
 * sample K-line data using the reduce method. 
 * You can replace kLineData with your actual data. The calculateSMA function takes an array of data and a window size and returns an array of SMA values.

Adjust the windowSize variable to calculate different SMA periods, such as a 5-day SMA or a 10-day SMA.
 * @param {*} data 
 * @param {*} window 
 * @returns 
 */

// Function to calculate SMA
function calculateSMA(data, window) {
    return data.map((item, index, array) => {
        if (index < window - 1) {
            return { date: item.date, sma: null }; // Not enough data to calculate SMA yet
        } else {
            const sum = array.slice(index - window + 1, index + 1)
                             .reduce((acc, cur) => acc + cur.closePrice, 0);
            const sma = sum / window;
            return { date: item.date, sma };
        }
    });
}

// Calculate 3-day SMA
const windowSize = 3;
const smaValues = calculateSMA(kLineData, windowSize);

// Print SMA values
smaValues.forEach(item => {
    console.log(`Date: ${item.date}, SMA: ${item.sma}`);
});