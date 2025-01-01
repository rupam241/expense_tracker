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
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw errorHandler(404, "User not found.");
      }

      // Update user profile in the database
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { username, email },  
      });

      return updatedUser;
    });

    const { password: _, ...userWithoutPass } = result;

    return res.status(200).json({
      message: "Profile updated successfully.",
      data: userWithoutPass,
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
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw errorHandler(404, "User not found.");
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        throw errorHandler(400, "Incorrect old password.");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return updatedUser;
    });
    const { password: _, ...userWithoutPass } = result;

    return res.status(200).json({
      message: "Password changed successfully.",
      data: userWithoutPass,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Account
export const deleteAccount = async (req, res, next) => {
  const userId = req.user.id; // Assuming user id is in the JWT token

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw errorHandler(404, "User not found.");
      }

      // Delete related entries (adjust model name if needed)
      await tx.entry.deleteMany({
        where: {
          userId: userId,
        },
      });

      // Delete the user from the database
      await tx.user.delete({
        where: { id: userId },
      });
      

      return { message: "Account deleted successfully." };
    });

    return res.status(200).json(result);
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
