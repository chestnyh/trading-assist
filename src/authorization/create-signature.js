const crypto = require('crypto');

module.exports = (paramsString, secretKey) => {
    return crypto.createHmac('sha256', secretKey).update(paramsString).digest('hex');
}