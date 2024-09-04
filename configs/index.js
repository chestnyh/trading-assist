import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') })

function getConfig() {
    return {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        BINANCE_API_KEY: process.env.BINANCE_API_KEY,
        BINANCE_API_SECRET: process.env.BINANCE_API_SECRET,
    }
}

const config = getConfig();

export default config