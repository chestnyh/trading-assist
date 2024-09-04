import fabric from './_fabric.js';

// TODO add documentation

const markPriceTime = (code, interval) => {

    return fabric({code, informationDetails: `markPrice@${interval}`})
}

export default markPriceTime;