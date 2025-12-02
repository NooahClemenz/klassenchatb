const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fetch = require("node-fetch"); // npm install node-fetch@2

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const WEBHOOK_URL = "DEIN_WEBHOOK_URL"; // Discord Webhook

app.use(express.static(__dirname)); // index.html ausliefern
app.use(express.json());

io.on("connection", (socket) => {
    console.log("Neuer User verbunden");

    socket.on("sendMessage", async (data) => {
        // Nachricht an Discord senden
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: `**${data.name}:** ${data.msg}` })
        });

        // Nachricht an alle verbundenen Clients senden
        io.emit("receiveMessage", data);
    });
});

server.listen(3000, () => console.log("Server läuft auf http://localhost:3000"));
