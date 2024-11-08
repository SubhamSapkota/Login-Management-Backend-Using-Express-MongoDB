import { config } from "dotenv";

config();

export const secretKey = process.env.SECRET_KEY
export const dbLink = process.env.DB_LINK