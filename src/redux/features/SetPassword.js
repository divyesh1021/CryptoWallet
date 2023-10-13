import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  password: "",
};

export const userPwdSlice = createSlice({
  name: "userPassword",
  initialState,
  reducers: {
    userPassword: (state, action) => {
        state.password = action.payload;      
    },
  },
});

export const { userPassword } = userPwdSlice.actions;

// Export the reducer directly, not the whole slice
export default userPwdSlice.reducer;
