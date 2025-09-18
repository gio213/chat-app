import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const [u1, u2] = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: { email: "alice@example.com", nickname: "Alice", passwordHash },
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: { email: "bob@example.com", nickname: "Bob", passwordHash },
    }),
  ]);
  const conv = await prisma.conversation.create({ data: {} });
  await prisma.participant.createMany({
    data: [
      { userId: u1.id, conversationId: conv.id },
      { userId: u2.id, conversationId: conv.id },
    ],
    skipDuplicates: true,
  });
  await prisma.message.create({
    data: { conversationId: conv.id, authorId: u1.id, body: "Hello Bob!" },
  });
  4;
  console.log({ convId: conv.id, alice: u1.email, bob: u2.email });
}
main().finally(() => prisma.$disconnect());
