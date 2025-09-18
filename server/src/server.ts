import http from "http";
import { createApp } from "./app";
import { attachSocket } from "./services";

async function main() {
  const app = createApp();
  const server = http.createServer(app);
  await attachSocket(server);

  server.listen(process.env.PORT, () => {
    console.log(`HTTP+Socket server listening on :${process.env.PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
