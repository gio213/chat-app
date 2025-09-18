import { Server, Socket } from "socket.io";
import { prisma } from "../lib/prisma";
import { ensureGuestUser } from "../services/messages";

const room = (conversationId: string) => `conv:${conversationId}`;

export function registerSocketHandlers(io: Server, socket: Socket) {
  const userId: string | undefined = socket.data.userId;
  console.log("✅ socket connected:", socket.id, { userId });

  socket.on("join_conversation", async (conversationId: string) => {
    if (!conversationId) return;
    if (userId) {
      const member = await prisma.participant.findFirst({
        where: { conversationId, userId },
        select: { id: true },
      });
      if (!member) return;
    }
    socket.join(room(conversationId));
    socket.emit("joined_conversation", conversationId);
  });

  socket.on(
    "typing",
    ({
      conversationId,
      isTyping,
    }: {
      conversationId: string;
      isTyping: boolean;
    }) => {
      socket.to(room(conversationId)).emit("typing", { userId, isTyping });
    }
  );

  socket.on(
    "send_message",
    async ({
      conversationId,
      body,
    }: {
      conversationId: string;
      body: string;
    }) => {
      if (!conversationId || !body?.trim()) return;

      if (userId) {
        const member = await prisma.participant.findFirst({
          where: { conversationId, userId },
          select: { id: true },
        });
        if (!member) return;
      }

      const authorId = userId ?? (await ensureGuestUser(prisma)).id;

      const msg = await prisma.message.create({
        data: { conversationId, authorId, body: body.trim() },
      });

      io.to(room(conversationId)).emit("new_message", msg);

      const participants = await prisma.participant.findMany({
        where: { conversationId },
      });
      if (participants.length) {
        await prisma.$transaction(
          participants.map((p) =>
            prisma.messageReceipt.create({
              data: { messageId: msg.id, userId: p.userId, status: "SENT" },
            })
          )
        );
      }
    }
  );

  socket.on("mark_read", async ({ messageId }: { messageId: string }) => {
    if (!userId) return;
    await prisma.messageReceipt.upsert({
      where: { messageId_userId_status: { messageId, userId, status: "READ" } },
      update: { at: new Date() },
      create: { messageId, userId, status: "READ" },
    });
    const msg = await prisma.message.findUnique({ where: { id: messageId } });
    if (msg) {
      io.to(room(msg.conversationId)).emit("message_read", {
        messageId,
        userId,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("👋 socket disconnected:", socket.id, { userId });
  });
}
