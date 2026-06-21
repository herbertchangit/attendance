import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(rootDirectory, "dist");
const publicDirectory = path.join(outputDirectory, "public");
const backendDirectory = path.join(outputDirectory, "backend");

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });
await cp(path.join(rootDirectory, "frontend", "dist"), publicDirectory, { recursive: true });
await cp(path.join(rootDirectory, "backend", "dist"), backendDirectory, { recursive: true });

console.log(`Deployment output prepared: ${outputDirectory}`);
