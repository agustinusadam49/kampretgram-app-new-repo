if (process.env.NODE_ENV == "development") {
    require("dotenv").config();
} else {
    require("dotenv").config();
}

console.log(process.env.NODE_ENV);

const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const http = require("http");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = require("socket.io")(server);
const indexRouter = require("./routes");
const errorHandlers = require("./middlewares/errorHandlers");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"))
app.use(indexRouter);
app.use(errorHandlers);

let num = 0;
let usersOnline = false;
let userLogout = false;
let userChangeProfile = false;
let snap = false;
let snapChange = false;
let snapLoveChange = false;
let snapCommentChange = false;
let snapEditPosted = false;
let snapDeletePosted = false;
let snapEditComment = false;
let snapDeleteComment = false;
let userNameCreateNewPost = "";
let snapSendMessage = false;

io.on("connection", function (socket) {
    num = num + 1;
    console.log(`User connected ${num}`);
    console.log('socket id:', socket.id);
    socket.on("trigger-user-online-from-register", (data) => {
        usersOnline = data;
        io.emit("trigger-user-online-from-register", usersOnline);
    });

    socket.on("trigger-user-online-from-login", (data) => {
        usersOnline = data;
        io.emit("trigger-user-online-from-login", usersOnline);
    });

    socket.on("trigger-user-logout", (data) => {
        userLogout = data;
        io.emit("trigger-user-logout", userLogout);
    });

    socket.on("trigger-change-profile", (data) => {
        userChangeProfile = data;
        io.emit("trigger-change-profile", userChangeProfile);
    });

    socket.on("create-new-post", (data) => {
        userNameCreateNewPost = data;
        io.emit("create-new-post", userNameCreateNewPost);
    });

    socket.on("create-new-post-snap", (data) => {
        snap = data;
        io.emit("create-new-post-snap", snap);
    });

    socket.on("trigger-change", (data) => {
        snapChange = data;
        io.emit("trigger-change", snapChange);
    });

    socket.on("trigger-love-change", (data) => {
        snapLoveChange = data;
        io.emit("trigger-love-change", snapLoveChange);
    });

    socket.on("trigger-comment-change", (data) => {
        snapCommentChange = data;
        io.emit("trigger-comment-change", snapCommentChange);
    });

    socket.on("trigger-edit-posted", (data) => {
        snapEditPosted = data;
        io.emit("trigger-edit-posted", snapEditPosted);
    });

    socket.on("trigger-delete-posted", (data) => {
        snapDeletePosted = data;
        io.emit("trigger-delete-posted", snapDeletePosted);
    });

    socket.on("trigger-edit-comment", (data) => {
        snapEditComment = data;
        io.emit("trigger-edit-comment", snapEditComment);
    });

    socket.on("trigger-delete-comment", (data) => {
        snapDeleteComment = data;
        io.emit("trigger-delete-comment", snapDeleteComment);
    });

    socket.on("send-message", (data) => {
        snapSendMessage = data;
        io.emit("send-message", snapSendMessage);
    })

    socket.on("user-typing", (data) => {
        socket.broadcast.emit("user-typing", data);
    })

    socket.on("user-stop-typing", () => {
        socket.broadcast.emit("user-stop-typing");
    })
})

server.listen(PORT, () => {
    console.log(`Aplikasi ini berjalan pada port :${PORT}`);
});

module.exports = app;