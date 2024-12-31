import express from "express"
import authRoutes from "./authRoutes.js"
import  userRoutes from "./userRoutes.js"
import  entryRoutes from "./entryRoutes.js"
import summaryRoutes from "./summaryRoutes.js"

const router=express.Router();


router.use("/auth",authRoutes);
router.use('/user',userRoutes)
router.use('/entry',entryRoutes)
router.use('/summary',summaryRoutes)



 
export default router