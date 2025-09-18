import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Health
router.get("/health", (_req, res) => res.send("OK"));

// History: /conversations/:id/messages
router.get("/conversations/:id/messages", async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    orderBy: { createdAt: "asc" },
    take: 200,
  });
  res.json(messages);
});

export default router;
