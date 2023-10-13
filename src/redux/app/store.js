import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userAccReducer from "../features/userAcc"; // Import the reducer, not the slice
import WalletSliceReducer from "../features/LockUnlock";
import userPwdSliceReducer from "../features/SetPassword";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  acc1: userAccReducer,
  auth: WalletSliceReducer,
  pwd : userPwdSliceReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    acc: persistedReducer,
  },
});

const persistor = persistStore(store);
export { persistor };
