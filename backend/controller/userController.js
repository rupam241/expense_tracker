import prisma from "../DB/db.config.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/errorHandler.js";


// Update Profile
export const updateProfile = async (req, res, next) => {
    const { username, email } = req.body;  // Use correct field names here
    const userId = req.user.id;  // Assuming user id is in the JWT token
  
    if (!username || !email) {
      return next(errorHandler(400, "Username and email are required."));
    }
  
    try {
      // Ensure the email is unique (if you want to enforce this rule)
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return next(errorHandler(404, "User not found."));
      }
  
      // Update user profile in the database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { username, email },  // Update correct fields
      });
  
      return res.status(200).json({
        message: "Profile updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
  

// Change Password
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id; // Assuming user id is in the JWT token

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(errorHandler(403, "Old password, new password, and confirm password are required."));
  }

  if (newPassword !== confirmPassword) {
    return next(errorHandler(400, "New password and confirm password do not match."));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return next(errorHandler(400, "Incorrect old password."));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      message: "Password changed successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Account
export const deleteAccount = async (req, res, next) => {
  const userId = req.user.id; // Assuming user id is in the JWT token

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    // Delete related entries (adjust model name if needed)
    await prisma.entry.deleteMany({
      where: {
        userId: userId,
      },
    });

    // Delete the user from the database
    await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({
      message: "Account deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};



export const signout = async (req, res, next) => {
    try {
   
      res.clearCookie('access_token', {
        httpOnly: true, 
       
        sameSite: 'Strict', 
      });
  
      return res.status(200).json({
        message: "Signed out successfully.",
      });
    } catch (error) {
      next(error);  // Pass any errors to the error handler middleware
    }
  };
  