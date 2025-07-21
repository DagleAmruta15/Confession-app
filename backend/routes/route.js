import express from 'express'
import { HandleSignUp,HandleLogin,HandleJoingroup,HandleCreateGroup,handleGroup ,HandleConfession,HandleUnreadMessages,HandleReport,HandlebackToGroups,HandleDelete,HandleDeleteAndBan} from '../controllers/controller.js'

const router = express.Router()

router.post('/login',HandleLogin)
router.post('/signup',HandleSignUp)
router.post('/joingroup',HandleJoingroup)
router.post('/creategroup',HandleCreateGroup)
router.post('/group',handleGroup)
router.post('/confession',HandleConfession)
router.post('/unread',HandleUnreadMessages)
router.post('/report',HandleReport)
router.post('/back',HandlebackToGroups)
router.post('/delete',HandleDelete)
router.post('/deleteAndBan',HandleDeleteAndBan)

export {router}