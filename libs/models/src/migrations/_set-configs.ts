import { ServicesConfigs } from '@trading-bot/configs';

const configs = new ServicesConfigs();

const DB_USER = configs.get('DB_USER');
const DB_PASSWORD = configs.get('DB_PASSWORD');
const DB_NAME = configs.get('DB_NAME');
const DB_HOST = configs.get('DB_HOST');
const DB_PORT = configs.get('DB_PORT');

// Use socket connection to avoid DNS resolution issues
process.env.DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:${DB_PORT}/${DB_NAME}?host=127.0.0.1` 