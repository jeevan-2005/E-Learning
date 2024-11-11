"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server);
    io.on("connection", (socket) => {
        console.log("A user connected.");
        // Listen to the "notification" event from frontend
        socket.on("notification", (data) => {
            // boradcast the new notification data to all clients connected (admin dashboard)
            io.emit("newNotification", data);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected.");
        });
    });
};
exports.initSocketServer = initSocketServer;
