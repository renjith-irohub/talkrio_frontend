import { createSlice } from "@reduxjs/toolkit";
import { decodedData, getToken } from "../utils/storageHandler";

const userData = decodedData() || {}; // ✅ Prevents crashing if token is invalid

export const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    name: userData.name || null,
    id: userData.id || null,
    role: userData.role || null,
    email: userData.email || null,
    isLogin: Boolean(getToken()), // ✅ Proper boolean check
  },
  reducers: {
    loginUserAction: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.isLogin = true;
    },
    registerUserAction: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.isLogin = true;
    },
    logoutAction: (state) => {
      state.name = null;
      state.email = null;
      state.id = null;
      state.role = null;
      state.isLogin = false;
      sessionStorage.removeItem("userToken"); // ✅ Clears token on logout
    },
  },
});

export default userSlice.reducer;
export const { loginUserAction, registerUserAction, logoutAction } = userSlice.actions;
