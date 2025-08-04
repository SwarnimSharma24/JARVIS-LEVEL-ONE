import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginData: [],
  error: null,
  loading: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    fetchLoginRequest: (state) => {
      console.log("fetchloginState>>>>", state);
      state.loading = true;
      state.error = null;
    },
    fetchLoginSuccess: (state, action) => {
      (state.loading = false);
      (state.loginData = action.payload);
    },
    fetchLoginFailure: (state, action) => {
      (state.loading = false);
       (state.error = action.payload);
    },
    clearLoginData: (state) => {
      state.loginData = {};
    },
  },
});

export const { fetchLoginRequest, fetchLoginFailure, fetchLoginSuccess,clearLoginData } =
  loginSlice.actions;

export default loginSlice.reducer; //export reducer to store.js
