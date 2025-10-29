// src/lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'], // add 'query' during debugging if needed
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
