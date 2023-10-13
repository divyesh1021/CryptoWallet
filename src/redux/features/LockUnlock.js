import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  check: "",
};

export const WalletSlice = createSlice({
  name: "lockunlock",
  initialState,
  reducers: {
    LockAccount: (state, action) => {
      state.check =action.payload;
    },
    unLockAccount: (state, action) => {
      state.check = action.payload;
    },
  },
});

export const { LockAccount, unLockAccount } = WalletSlice.actions;

export default WalletSlice.reducer;
