import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalIncome: 0,
  totalExpenses: 0,
  balance: 0,
  loading: false,
  error: null,
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    fetchSummaryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSummarySuccess: (state, action) => {
      state.loading = false;
      const { totalIncome, totalExpenses, balance } = action.payload;
      state.totalIncome = totalIncome;
      state.totalExpenses = totalExpenses;
      state.balance = balance;
    },
    fetchSummaryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchSummaryRequest, fetchSummarySuccess, fetchSummaryFailure } = summarySlice.actions;
export default summarySlice.reducer;
