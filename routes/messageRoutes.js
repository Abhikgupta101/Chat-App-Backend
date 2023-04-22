const express = require('express')
const {
    sendMessage,
    deleteMessage,
    search
} = require('../controllers/messageController')

const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

//middleware

router.use(requireAuth)
router.post('/sendMessage/:id', sendMessage)
router.post('/deleteMessage/:id', deleteMessage)

module.exports = router