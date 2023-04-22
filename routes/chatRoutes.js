const express = require('express')
const {
    getAllChats,
    singleChat,
    createChatRoom,
    createPrivateChat,
    exitChat,
    addNewMember,
    search
} = require('../controllers/chatController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

//middleware

router.use(requireAuth)

//routes
router.get('/', getAllChats)
router.get('/singleChat/:id', singleChat)
router.post('/chatRoom', createChatRoom)
router.post('/privateChat', createPrivateChat)
router.get('/exitChat/:id', exitChat)
router.post('/addNewMember/:id', addNewMember)
router.get('/search', search)


module.exports = router