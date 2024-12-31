import express from 'express'
import { getSummary } from '../controller/summaryController.js';
import { verifyUser } from '../utils/verifyUser.js';
const router=express.Router();

router.get('/get-summary',verifyUser,   getSummary)

export default router