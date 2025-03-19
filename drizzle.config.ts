import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  throw new Error("POSTGRES_URL is not defined in the environment variables.");
}

export default defineConfig({
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  strict: true,
  verbose: true,
});