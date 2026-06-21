import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const serverFile = fileURLToPath(new URL("../dist/server.js", import.meta.url));

if (!existsSync(serverFile)) {
  throw new Error(`Backend build output is missing: ${serverFile}`);
}

console.log(`Backend build verified: ${serverFile}`);
