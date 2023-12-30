require('dotenv').config();

module.exports = {
    SECRET_KEY: process.env.FEATURE_SECRET_KEY,
    API_KEY: process.env.FEATURE_API_KEY,
}