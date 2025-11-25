import express from 'express'
const router = express.Router()
import { homeValid } from '../middleware/auth.js';
// import { csrfProtection } from '../middleware/auth.js';





import { 
    signupPage,
    signupHandler,
    loginPage,
    loginHandler,
    logout
 } from "../controllers/authController.js";

router.get('/signup', homeValid, signupPage)
router.post('/signup', signupHandler)

router.get('/login', homeValid,  loginPage)
router.post('/login', loginHandler )

router.get('/logout', logout)

export default router