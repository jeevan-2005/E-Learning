import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
    },
    userLoggedOut: (state) => {
      state.user = "";
      state.token = "";
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions;
export default authSlice;
