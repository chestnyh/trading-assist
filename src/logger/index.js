const fs = require('node:fs');

const fileName = process.env.LOG_FILE_NAME || 'logs';

const log = (info) => {
    console.log(info);
    fs.appendFileSync(fileName, `${info}\n`);
}

module.exports = {
    log
}