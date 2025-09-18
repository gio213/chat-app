import { createClient } from "redis";

export async function getRedisPubSub() {
  const pub = createClient({ url: process.env.REDIS_URL });
  const sub = pub.duplicate();
  await pub.connect();
  await sub.connect();
  return { pub, sub };
}
