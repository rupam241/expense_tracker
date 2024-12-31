import { createSlice } from '@reduxjs/toolkit';

// Initial state for entries
const initialState = {
  entries: [],  // This can remain the same as it is just the name of the property in state
  isLoading: false,
  error: null,
};

const entrySlice = createSlice({
  name: 'entrySlice', // Changed the slice name to 'entrySlice' to avoid conflict with the state property name
  initialState,
  reducers: {
    fetchEntriesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchEntriesSuccess: (state, action) => {
      state.entries = action.payload; // This refers to the 'entries' property of the state
      state.isLoading = false;
    },

    fetchEntriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addEntry: (state, action) => {
      // Make sure state.entries is an array before calling push
      if (Array.isArray(state.entries)) {
        state.entries.push(action.payload);
      } else {
        // If it's not an array, initialize it as an empty array first
        state.entries = [action.payload];
      }
    },

    updateEntry: (state, action) => {
      const index = state.entries.findIndex((entry) => entry.id === action.payload.id);
      if (index !== -1) {
        // Replace the entry amount with the new one, without adding
        state.entries[index] = {
          ...state.entries[index], 
          amount: action.payload.amount // Explicitly update the amount field
        };
      }
    },

    deleteEntry: (state, action) => {
      const { id } = action.payload;
      state.entries = state.entries.filter(entry => entry.id !== id); 
    },
  },
});

export const {
  fetchEntriesRequest,
  fetchEntriesSuccess,
  fetchEntriesFailure,
  addEntry,
  updateEntry,
  deleteEntry,
} = entrySlice.actions;

export default entrySlice.reducer;
