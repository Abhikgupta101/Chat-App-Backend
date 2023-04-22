const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const Message = require('../models/messageModel')
const mongoose = require('mongoose')

const sendMessage = async (req, res) => {
    const user_id = req.user._id

    //chat id
    const { id } = req.params
    try {
        var user = await User.findById({ _id: user_id })

        var obj = {
            text: req.body.text,
            user_id,
            user_name: user.name,
            avatar: user.avatar,
            chat: id,
            createdAt: Date()
        }

        const message = await Message.create(obj)

        var chat = await Chat.findById({ _id: id })

        await chat.updateOne({ $set: { "lastMessage": message } })

        res.status(200).json(message)
    }
    catch (error) {
        res.status(400).json({ error })
    }
}


// need to work of controllers
const deleteMessage = async (req, res) => {
    const user_id = req.user._id
    //chat id
    const { id } = req.params

    //msg id
    var msg = req.body.msg
    try {
        var user = await User.findById({ _id: user_id })
        const chat = await Chat.findById({ _id: id })
        const message = await Message.findById({ _id: msg })

        if (chat.lastMessage._id == msg) {
            await chat.updateOne({
                $set: {
                    "lastMessage": {
                        text: "message was deleted",
                        user_id,
                        user_name: user.name,
                        avatar: user.avatar,
                        _id: msg
                    }
                }
            })
        }

        await message.updateOne({
            $set: {
                "text": "message was deleted",
            }
        })

        var obj = {
            text: "message was deleted",
            user_id,
            user_name: user.name,
            avatar: user.avatar,
            _id: msg
        }

        res.status(200).json(obj)
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
        })

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
    sendMessage,
    deleteMessage,
    search
}