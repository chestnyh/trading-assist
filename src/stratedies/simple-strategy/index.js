const fs = require('node:fs');

const fileToLog = `logs`

class SimpleStrategy {

    #checkInterval = 60 * 1000
    #coinFollower;
    
    constructor({coinFollower}){
        this.#coinFollower = coinFollower;
    }

    isRising(prices){
        let raisingAmount = 0;
        let previous = 0;
        prices.forEach(price => {

            price = parseFloat(price);

            if (previous === 0){
                previous = price;
                return;
            }
                
            if(price > previous){
                raisingAmount++;
            }
        });

        if(raisingAmount >= 10){
            return true;
        }
    }

    isDowning(prices){

        let downingAmount = 0;
        let previous = 0;
        prices.forEach(price => {

            price = parseFloat(price);

            if (previous === 0) {
                previous = price;
                return;
            }

            if (price < previous) {
                downingAmount++;
            }
        });

        if (downingAmount >= 10) {
            return true;
        }

    }

    run(){
        setInterval(() => {

            const candles = this.#coinFollower.candlesArr;
            const checkSet = candles.slice(-11);

            if (this.isRising(checkSet)){
                fs.appendFileSync(fileToLog, "---SHOULD BE SHORT HERE---\n");
                fs.appendFileSync(fileToLog, JSON.stringify(checkSet) + '\n');
                fs.appendFileSync(fileToLog, "---SHOULD BE SHORT HERE---\n");
                console.log("---SHOULD BE SHORT HERE---");
                console.log(JSON.stringify(checkSet))
                console.log("---SHOULD BE SHORT HERE---");
            }

            if (this.isDowning(checkSet)) {
                fs.appendFileSync(fileToLog, "---SHOULD BE LONG HERE---\n");
                fs.appendFileSync(fileToLog, JSON.stringify(checkSet) + '\n');
                fs.appendFileSync(fileToLog, "---SHOULD BE LONG HERE---\n");
                console.log("---SHOULD BE LONG HERE---");
                console.log(JSON.stringify(checkSet))
                console.log("---SHOULD BE LONG HERE---");
            }
            
            // If last 10 rising doing short
            // If last 10 doening doing long
        }, this.#checkInterval);
    }

}

module.exports = SimpleStrategy;