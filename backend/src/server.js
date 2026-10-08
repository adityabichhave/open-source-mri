import app from "./app.js";

const PORT = 5001;

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log("SERVER STARTED");
  console.log("LISTENING:", server.listening);
  console.log("ADDRESS:", server.address());
});

server.on("listening", () => {
  console.log("LISTEN EVENT");
});

server.on("close", () => {
  console.log("🚨 SERVER CLOSED");
});

setInterval(() => {
  console.log("ALIVE:", server.listening);
}, 2000);