import { createSlice } from '@reduxjs/toolkit';

// Initial state for entries
const initialState = {
  entries: [],  
  isLoading: false,
  error: null,
};

const entrySlice = createSlice({
  name: 'entrySlice',
  initialState,
  reducers: {
    fetchEntriesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchEntriesSuccess: (state, action) => {
      state.entries = action.payload; 
      state.isLoading = false;
    },

    fetchEntriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addEntry: (state, action) => {
      
      if (Array.isArray(state.entries)) {
        state.entries.push(action.payload);
      } else {
   
        state.entries = [action.payload];
      }
    },

    updateEntry: (state, action) => {
      const index = state.entries.findIndex((entry) => entry.id === action.payload.id);
      if (index !== -1) {
      
        state.entries[index] = {
          ...state.entries[index], 
          amount: action.payload.amount 
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
