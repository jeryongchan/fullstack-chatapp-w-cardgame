require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors")
const authRouter = require("./routers/authRouter.js");
const imageRouter = require("./routers/imageRouter.js");
const { sessionMiddleware, wrap, corsConfig } = require("./controllers/serverController.js");
const { endTurn, receiveGameState, authorizeUser, initializeUser, addFriend, onDisconnect, dm, createGameRoom, joinGameRoom, leaveGameRoom } = require("./controllers/socketController.js");


const server = require("http").createServer(app);

const port = process.env.PORT || 4000;

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static('build'));
//     app.get("*", (req, res) => {
//         req.sendFile(path.resolve(__dirname, 'build', 'index.html'))
//     })
// }

const io = new Server(server, {
    cors: corsConfig
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);
app.use("/auth", authRouter);
app.use("/image", imageRouter);
app.set("trust proxy", 1)

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", socket => {
    initializeUser(socket);
    socket.on("add_friend", (friendName, callback) => {
        addFriend(socket, friendName, callback);
    });
    socket.on("dm", message => dm(socket, message));
    socket.on("disconnecting", () => onDisconnect(socket, io));
    socket.on("create_game", (data, callback) => createGameRoom(socket, io, data, callback));
    socket.on("join_game", (data, callback) => joinGameRoom(socket, io, data, callback));
    socket.on("leave_game", (data, callback) => leaveGameRoom(socket, io, data, callback));
    socket.on("send_game_state", (data) => receiveGameState(socket, io, data));
    socket.on("end_turn", (data) => endTurn(socket, io, data));
});


server.listen(port, () => {
    console.log("Server listening on port 4000")
});