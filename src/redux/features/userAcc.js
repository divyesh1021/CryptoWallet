import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const userAccSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    userAccount: (state, action) => {
      state.value.push(action.payload);
    },
    removeUser: (state, action) => {
      state.value = state.value.filter(
        (item) => item.Public_key !== action.payload
      );
    },
  },
});

export const { userAccount, removeUser } = userAccSlice.actions;

// Export the reducer directly, not the whole slice
export default userAccSlice.reducer;
