import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BOT_TOKEN = process.env.TELEGRAM_BOT_API;
const WEBAPP_URL = process.env.WEBAPP_URL;

export { BOT_TOKEN, WEBAPP_URL };
