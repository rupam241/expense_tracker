import { createSlice, current, nanoid } from "@reduxjs/toolkit";

const initialState = {
    currentuser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentuser = action.payload;
            state.loading = false;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; 
        },
       updateStart:(state,action)=>{
        state.loading = true;
        state.error = null;
       },
       updateSucess:(state,action)=>{
        state.currentuser=action.payload;
        state.loading = false;
        state.error=null

       },
       updateFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload; 
    },
    deleteAccountSucess:(state,action)=>{
        state.currentuser=null;
        state.loading=false;
        state.error=false
    },
    deleteAccountStart:(state,action)=>{
        state.loading = true;
        state.error = null;
       },
       deleteAccountFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload; 
    },

          signoutSucess:(state,action)=>{
        state.currentuser=null;
        state.loading=false;
        state.error=false
    },
    signoutStart:(state,action)=>{
        state.loading = true;
        state.error = null;
       },
       signoutFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload; 
    },
    },
});

export const { signInStart, signInSuccess, signInFailure,updateFailure,updateStart,updateSucess,deleteAccountSucess,deleteAccountStart,deleteAccountFailure ,signoutFailure,signoutStart,signoutSucess} = userSlice.actions;
export default userSlice.reducer;