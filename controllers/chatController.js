const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const Message = require('../models/messageModel')
const mongoose = require('mongoose')

//get all chats
const getAllChats = async (req, res) => {
    const user_id = req.user._id
    try {
        const chat = await Chat.find().sort({ createdAt: -1 })
        let chats = []
        for (let i = 0; i < chat.length; i++) {

            for (let j = 0; j < chat[i].users.length; j++) {
                if (chat[i].users[j].id == user_id) {
                    chats.push(chat[i])
                }
            }
        }
        res.status(200).json(chats)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const singleChat = async (req, res) => {
    const user_id = req.user._id

    //chat id
    const { id } = req.params
    try {
        const chat = await Chat.findById({ _id: id }).populate({ path: 'messages' })
        res.status(200).json(chat.messages)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//create chat room
const createChatRoom = async (req, res) => {
    const user_id = req.user._id

    const image = req.body.image
    try {
        var user = await User.findById({ _id: user_id })
        const chat_room = await Chat.create(
            {
                name: req.body.name,
                admin: user_id,
                avatar: image,
                type: "group",
                lastMessage: {
                    text: null,
                    user_id: null,
                    user_name: null,
                    avatar: null,
                    _id: null
                },
                userIds: req.body.userIds,
                users: []
            }
        )

        res.status(200).json(chat_room)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}


//need to work on private chat...giving issues

const createPrivateChat = async (req, res) => {
    const user_id = req.user._id
    //object containing user2 data
    const user2_id = req.body.userId
    try {
        var user = await User.findById({ _id: user_id })
        var user2 = await User.findById({ _id: user2_id })

        var privateChat = await Chat.find({ userIds: { $all: [user2_id, user_id] } }).where("type").equals("private")

        if (privateChat.length == 1) {
            res.status(200).json({
                message: "found",
                privateChat: privateChat[0]
            })

            return
        }

        privateChat = await Chat.create(
            {
                name: null,
                admin: null,
                avatar: null,
                type: "private",
                lastMessage: {
                    text: null,
                    user_id: null,
                    user_name: null,
                    avatar: null,
                    _id: null
                },
                userIds: [user_id, user2_id],
                users: [
                    { id: user_id, name: user.name, avatar: user.avatar },
                    { id: user2_id, name: user2.name, avatar: user2.avatar }
                ]
            }
        )

        res.status(200).json({
            message: "new chat created",
            privateChat
        })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//need to work on exit chat chat is not deleting and other stuff

const exitChat = async (req, res) => {
    const user_id = req.user._id
    //chat id
    const { id } = req.params
    try {
        var user = await User.findById({ _id: user_id })
        var chat = await Chat.findById({ _id: id })
        if (chat.type == "private" || chat.admin == user_id) {
            await Chat.deleteOne({ _id: id })
            await Message.deleteMany({ chat: id })
        }
        else {
            await chat.updateOne({ $pull: { "userIds": user_id } })
        }
        return res.status(200).json({ message: 'You have successfully left the chat' })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//need to include edit name option
//nned to include update image

const addNewMember = async (req, res) => {
    const user_id = req.user._id
    //chat id
    const { id } = req.params

    try {
        var user = await User.findById({ _id: user_id })
        var chat = await Chat.findById({ _id: id })

        chat = await chat.updateOne({ $push: { "userIds": [...req.body.userIds] } })

        res.status(200).json({ message: 'added', chat })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const search = async (req, res) => {
    try {
        const search = req.query.search || "";

        const chats = await Chat.find({
            name: {
                $regex: search,
                $options: "i"
            }
        }).where("type").equals("group")

        const users = await User.find({
            name: {
                $regex: search,
                $options: "i"
            }
        })

        res.status(200).json({
            error: false,
            chats,
            users
        })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllChats,
    singleChat,
    createChatRoom,
    createPrivateChat,
    exitChat,
    addNewMember,
    search
}