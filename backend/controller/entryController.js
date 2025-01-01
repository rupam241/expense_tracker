import prisma from "../DB/db.config.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createEntry = async (req, res, next) => {
  const userId = req.user.id;
  const { amount, type, description } = req.body;

  if (!amount || !type) {
    return next(errorHandler(403, "All the information are required"));
  }

  const amountFloat = parseFloat(amount);

  if (isNaN(amountFloat)) {
    return next(errorHandler(400, "Invalid amount provided. Must be a number."));
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const totalIncome = await tx.entry.aggregate({
        where: { userId, type: 'income' },
        _sum: { amount: true },
      });

      const totalExpense = await tx.entry.aggregate({
        where: { userId, type: 'expense' },
        _sum: { amount: true },
      });

      const currentBalance = (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0);

      if (type === "expense" && currentBalance < amountFloat) {
        throw errorHandler(400, "Insufficient balance to make this expense.");
      }

      const entry = await tx.entry.create({
        data: {
          amount: amountFloat,
          type,
          description: description || null,
          userId,
        },
      });

      return entry;
    });

    res.status(200).json({
      message: "Entry created successfully",
      entry: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEntry = async (req, res, next) => {
  const userId = req.user.id;
  const { type, startDate, endDate, page = 1, pageSize = 7 } = req.query;

  const skip = (page - 1) * pageSize;

  const filters = {
    userId,
    ...(type && { type }),
    ...(startDate && { createdAt: { gte: new Date(startDate) } }),
    ...(endDate && { createdAt: { lte: new Date(endDate) } }),
  };

  try {
    const entries = await prisma.entry.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(pageSize),
    });

    const totalEntries = await prisma.entry.count({ where: { userId } });

    res.status(200).json({message:"Entry fetch successfully", entries, totalEntries });
  } catch (error) {
    next(errorHandler(500, "Error fetching entries"));
  }
};

export const updateEntry = async (req, res, next) => {
  const { id } = req.params;
  const { amount, type, description } = req.body;
  const userId = req.user.id;

  if (!amount || !type) {
    return next(errorHandler(400, "Amount and type are required"));
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingEntry = await tx.entry.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingEntry || existingEntry.userId !== userId) {
        throw errorHandler(404, "Entry not found or unauthorized");
      }

      const totalIncome = await tx.entry.aggregate({
        where: { userId, type: 'income' },
        _sum: { amount: true },
      });

      const totalExpense = await tx.entry.aggregate({
        where: { userId, type: 'expense' },
        _sum: { amount: true },
      });

      const currentBalance = (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0);

      if (type === "expense" && currentBalance < amount) {
        throw errorHandler(400, "Insufficient balance to make this expense.");
      }

      if (amount <= 0) {
        throw errorHandler(400, "Amount must be greater than zero");
      }

      const updatedEntry = await tx.entry.update({
        where: { id: parseInt(id) },
        data: {
          amount,
          type,
          description: description || null,
        },
      });

      return updatedEntry;
    });

    res.status(200).json({
      message: "Entry updated successfully",
      updatedEntry: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingEntry = await tx.entry.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingEntry || existingEntry.userId !== userId) {
        throw errorHandler(404, "Entry not found or unauthorized");
      }

      await tx.entry.delete({
        where: { id: parseInt(id) },
      });

      return { message: "Entry deleted successfully" };
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
