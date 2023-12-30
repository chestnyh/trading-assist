const fs = require('node:fs');

const fileName = 'log-file';

const log = (info) => {
    fs.appendFileSync(fileName, `${info}\n`);
}

module.exports = {
    log
}