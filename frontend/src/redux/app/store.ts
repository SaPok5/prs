import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import authReducer from "../auth/authSlice";
import userReducer from "../user/userSlice";
import teamReducer from "../teams/teamSlice"
import roleReducer from "../roles/roleSlice"
import dealReducer from "../deal/dealSlice"

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { apiSlice } from "./api";

// Redux Persist config for the auth state
const persistConfig = {
  key: "prs",
  version: 1,
  storage,
  // whitelist: ['auth'],
};

// Create the persisted reducer for auth
const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]:apiSlice.reducer,
    auth: persistedReducer,
    user: userReducer,
    team:teamReducer,
    roles:roleReducer,
    deal:dealReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
