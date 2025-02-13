import { PrismaClient } from "@prisma/client";

type PrismaType = InstanceType<typeof PrismaClient>;

const globalForDb = globalThis as unknown as {
  db: PrismaType | undefined;
};

export default async function getPrismaClient(): Promise<PrismaType> {
  const dbClient = globalForDb.db ?? new PrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForDb.db = dbClient;
  }

  return dbClient;
}
