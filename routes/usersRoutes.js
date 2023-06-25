import { Router } from 'express';
import { getAllUsers } from '../controllers/userscontrollers.js';
import * as sessionAuth from '../controllers/sessionAuthController.js'
import * as jwtAuth from '../controllers/jwtAuthController.js'
const router =  Router();

//global signup
router.route('/signup').post(sessionAuth.signup)

//test routes
// router.route('/').get(sessionAuth.isLoggedIn, sessionAuth.restrictTo('ADMIN'), getAllUsers)
router.route('/').get(jwtAuth.isLoggedIn, jwtAuth.restrictTo('ADMIN'), getAllUsers)



//session auth routes
router.route('/session/login').post(sessionAuth.login)
router.route('/session/logout').get(sessionAuth.logout)

//jwt auth routes
router.route('/jwt/login').post(jwtAuth.login)


export default router;