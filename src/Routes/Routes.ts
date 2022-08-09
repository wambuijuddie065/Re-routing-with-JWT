import {Router} from 'express';
import { checkUser, getHomepage, loginUser, registerUser } from '../Controllers/UsersController';
import { VerifyToken } from '../Middleware/VerifyToken';
const router=Router()

router.post('/login',loginUser)
router.post('/signup',registerUser)
router.get('/homepage',VerifyToken,getHomepage)
router.get('/check',VerifyToken,checkUser)

export default router;