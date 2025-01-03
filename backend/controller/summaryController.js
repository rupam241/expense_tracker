import prisma from "../DB/db.config.js";

export const getSummary = async (req, res, next) => {
  const userId = req.user.id;
  const { startDate, endDate, period } = req.query;

  let filters = {
    userId,
  };

  if (period) {
    let dateRange;
    const currentDate = new Date();

    switch (period) {
      case '3':
        dateRange = { gte: new Date(currentDate.setDate(currentDate.getDate() - 3)) };
        break;
      case '7':
        dateRange = { gte: new Date(currentDate.setDate(currentDate.getDate() - 7)) };
        break;
      case '30':
        dateRange = { gte: new Date(currentDate.setDate(currentDate.getDate() - 30)) };
        break;
      case '1':
        dateRange = { gte: new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)) };
        break;
      default:
        dateRange = {};
        break;
    }

    filters = { ...filters, createdAt: dateRange };
  }

  if (startDate) {
    filters.createdAt = { ...filters.createdAt, gte: new Date(startDate) };
  }
  if (endDate) {
    filters.createdAt = { ...filters.createdAt, lte: new Date(endDate) };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const totalIncome = await tx.entry.aggregate({
        where: {
          ...filters,
          type: 'income',
        },
        _sum: {
          amount: true,
        },
      });

      const totalExpenses = await tx.entry.aggregate({
        where: {
          ...filters,
          type: 'expense',
        },
        _sum: {
          amount: true,
        },
      });

      const totalIncomeAmount = totalIncome._sum.amount || 0;
      const totalExpensesAmount = totalExpenses._sum.amount || 0;
      
      const balance = totalIncomeAmount - totalExpensesAmount;

      return { totalIncomeAmount, totalExpensesAmount, balance };
    });

    res.status(200).json({
      message: "Fetch summary successful",
      totalIncome: result.totalIncomeAmount,
      totalExpenses: result.totalExpensesAmount,
      balance: result.balance,
    });
  } catch (error) {
    next(error);
  }
};
