import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'; 
import entryReducer from "../redux/entrySlice";
import userReducer from "../redux/userSlice";
import summarySlice from "../redux/summarySlice"
// import financialSummaryReducer from "../redux/summarySlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers({
  user: userReducer,
  entrySlice: entryReducer,
  summarySlice:summarySlice
  
});


const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});


export const persistor = persistStore(store);
export default store;
