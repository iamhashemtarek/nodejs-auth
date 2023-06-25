import { Router } from 'express';
import { getAllUsers } from '../controllers/userscontrollers.js';
import { signup, login, protect, logout } from '../controllers/sessionAuthController.js'
import {restrictTo} from '../middlewares/authorization.js';
const router =  Router();

router.route('/').get(protect, restrictTo('ADMIN'), getAllUsers)

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)

export default router;