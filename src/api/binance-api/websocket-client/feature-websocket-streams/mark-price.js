import fabric from './_fabric.js';

// TODO add documentation

const markPrice = (code) => {
    return fabric({code, informationDetails: 'markPrice'})
}

export default markPrice;
