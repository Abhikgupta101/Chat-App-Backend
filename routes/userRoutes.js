const express = require('express')
const {
    createUser,
    getUser,
    getUsers,
    accountLogin,
    logout,
    sendEmail,
    changePassword
} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.post('/signup', createUser)
router.post('/login', accountLogin)
router.post('/sendEmail', sendEmail)
router.post('/changePassword', changePassword)
//middleware
router.use(requireAuth)

router.get('/info/:id', getUser)
router.get('/', getUsers)
router.get('/', logout)



module.exports = router