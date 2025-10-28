import dotenv from "dotenv";

dotenv.config();

export const environment = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_ANON_KEY,
};