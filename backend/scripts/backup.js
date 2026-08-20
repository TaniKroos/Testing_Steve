import { copyFile, mkdir } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
if (!databaseUrl.startsWith("file:")) throw new Error("SQLite backups require a file: DATABASE_URL.");

const source = resolve(process.cwd(), databaseUrl.slice(5));
const backupDirectory = resolve(process.cwd(), "backups");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = resolve(backupDirectory, `${basename(source, ".db")}-${timestamp}.db`);

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);
console.log(`SQLite backup created: ${destination}`);
