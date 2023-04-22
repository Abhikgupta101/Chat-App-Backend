require('dotenv').config()
const express = require('express')
const http = require("http");
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const chatRoutes = require('./routes/chatRoutes')
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { Server } = require('socket.io');
const cors = require("cors");
const app = express()

app.use(cors({
    origin: 'https://social-media-chat-app.netlify.app',
    credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

//routes
app.use('/api/user', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/message', messageRoutes)

const server = http.createServer(app);
const PORT = process.env.PORT || 4000

// const server = app.listen(process.env.PORT, () => {
//     console.log('Listening on port', process.env.PORT)
// })

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => { server })
    .catch((error) => {
        console.log(error)
    })


const io = new Server(server, {
    cors: {
        origin: "https://social-media-chat-app.netlify.app",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data.room)
    })

    socket.on("send_message", (data) => {

        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("delete_message", (data) => {

        socket.to(data.room).emit("message_deleted", data)
    })
})

server.listen(PORT, () => {
    console.log('Server is running')
})