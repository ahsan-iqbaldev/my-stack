import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import communitySlice from "./slices/communitySlice";
import questionSlice from "./slices/questionSlice";
import profileSlice from "./slices/profileSlice";
import homeSlice from "./slices/homeSlice";

const reducers = combineReducers({
  authentication: authSlice,
  community: communitySlice,
  question: questionSlice,
  profile: profileSlice,
  home: homeSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authentication"],
};

export type RootState = ReturnType<typeof reducers>;

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
