import { PrismaClient } from "@prisma/client";

export async function ensureGuestUser(prisma: PrismaClient) {
  const email = "guest@example.com";
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Guest" },
  });
}
