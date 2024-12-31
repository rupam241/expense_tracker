import express from "express"
import { updateProfile,changePassword,deleteAccount, signout } from "../controller/userController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router=express.Router();


router.put("/update-profile",verifyUser,updateProfile)
router.put("/change-password",verifyUser,changePassword)
router.delete('/delete-account',verifyUser,deleteAccount)
router.delete('/sign-out',verifyUser,signout)

export default router