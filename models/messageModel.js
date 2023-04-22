const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    text: {
        type: String,
        required: [true, 'Message is empty']
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Message must belong to a user']
    },
    user_name: {
        type: String,
        required: [true, 'Name of user required']
    },
    avatar: {
        type: String,
    },
    chat: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat',
        required: [true, 'Message must belong to a chat.']
    },
    createdAt: {
        type: "String",
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })
module.exports = mongoose.model('Message', messageSchema)