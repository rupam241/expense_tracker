import express from "express"
import {signup} from '../controller/authController.js'
import {signin} from '../controller/authController.js'
const router=express.Router();
router.post("/sign-up",signup)
router.post("/sign-in",signin)


export default router