import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./auth-schema";

function isPostgresConnectionString(raw: string): boolean {
  return /^postgres(ql)?:\/\//i.test(raw.trim());
}

function getDatabaseUrl(): string {
  const sources = [
    ["DATABASE_URL", process.env.DATABASE_URL],
    ["POSTGRES_URL", process.env.POSTGRES_URL],
    ["POSTGRES_PRISMA_URL", process.env.POSTGRES_PRISMA_URL],
    ["POSTGRES_URL_NON_POOLING", process.env.POSTGRES_URL_NON_POOLING],
    ["NEON_DATABASE_URL", process.env.NEON_DATABASE_URL],
  ] as const;

  const diagnostics: string[] = [];

  for (const [key, raw] of sources) {
    if (!raw) {
      diagnostics.push(`${key}=missing`);
      continue;
    }

    const value = raw.trim();
    if (!isPostgresConnectionString(value)) {
      diagnostics.push(`${key}=invalid_scheme`);
      continue;
    }

    try {
      const parsed = new URL(value);

      // Some deployments accidentally set `DATABASE_URL` (or similar) to a placeholder like
      // `base`, which `pg` interprets as a hostname and then fails with `getaddrinfo ENOTFOUND base`.
      if (!parsed.hostname || parsed.hostname.toLowerCase() === "base") {
        diagnostics.push(`${key}=invalid_host`);
        continue;
      }

      if (process.env.NODE_ENV !== "test") {
        console.info(`[db] Using Postgres connection string from ${key}`);
      }

      return value;
    } catch {
      diagnostics.push(`${key}=invalid_url`);
    }
  }

  throw new Error(
    `Configuration error: missing or invalid Postgres connection string. ` +
      `Expected one of ${sources.map(([key]) => key).join(", ")} to be a valid Postgres URL ` +
      `(starting with "postgres://" or "postgresql://"). ` +
      `Example: postgres://user:password@host:5432/dbname. Diagnostics: ${diagnostics.join(
        ", ",
      )}`,
  );
}

const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

export const db = drizzle(pool, { schema });
