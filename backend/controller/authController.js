import bcrypt from 'bcrypt';
import prisma from "../DB/db.config.js";
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/errorHandler.js";

export const signup = async (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return next(errorHandler(403, "All fields are required."));
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        throw errorHandler(400, "Email or username already in use.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      return newUser;
    });

    const { password: _, ...userWithoutPass } = result;

    return res.status(201).json({
      message: "User created successfully.",
      data: userWithoutPass,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(403, "All fields are required."));
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw errorHandler(400, "Invalid email or password.");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw errorHandler(400, "Invalid email or password.");
      }

      return user;
    });

    const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPass } = result;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "User logged in successfully.",
        data: userWithoutPass,
      });
  } catch (error) {
    next(error);
  }
};
