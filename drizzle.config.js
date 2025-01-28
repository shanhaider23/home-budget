import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();


export default defineConfig({
    dialect: 'postgresql',
    schema: './utils/schema.jsx',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL,
    },
    out: "./drizzle",
});
