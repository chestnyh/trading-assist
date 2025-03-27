import * as dotenv from 'dotenv';
if (process.env.NODE_ENV === 'api-int-tests') {
    dotenv.config({ path: './.env.api-int-tests' });
}
else if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

export default () => {

    // PORT
    const PORT = parseInt(process.env.PORT, 10) || 3000;

    // DATABASE
    const DB_USER = process.env.DB_USER;
    const DB_PASSWORD = process.env.DB_PASSWORD;
    const DB_NAME = process.env.DB_NAME;
    const DB_HOST = process.env.DB_HOST;
    const DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;
    const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

    return {
        PORT,

        DB_USER,
        DB_PASSWORD,
        DB_NAME,
        DB_HOST,
        DB_PORT,
        DB_URL
    }
}