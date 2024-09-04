import fabric from './_fabric.js';

// TODO add documentation

const aggregateTrade = (code) => {
    return fabric({code, informationDetails: 'aggTrade'})
}

export default aggregateTrade;