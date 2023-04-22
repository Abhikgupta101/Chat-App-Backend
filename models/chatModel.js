const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    name: {
        type: String,
    },
    admin: {
        type: String,
    },
    avatar: {
        type: String,
    },
    type: {
        type: String,
        required: [true, 'Chat type is required']
    },
    userIds: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Chat must belong to a user']
        },
    ],
    users: [
        {
            id: { type: String },
            name: { type: String },
            avatar: { type: String },
        }
    ],
    lastMessage: {
        text: { type: String },
        user_id: { type: String },
        user_name: { type: String },
        avatar: { type: String },
        _id: { type: String },
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

// Virtual populate
chatSchema.virtual('messages', {
    ref: 'Message',
    foreignField: 'chat',
    localField: '_id'
});

module.exports = mongoose.model('Chat', chatSchema)