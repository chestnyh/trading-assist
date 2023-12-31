const fs = require('node:fs');

const fileName = 'logs';

const log = (info) => {
    console.log(info);
    fs.appendFileSync(fileName, `${info}\n`);
}

module.exports = {
    log
}