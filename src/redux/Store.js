import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";
// import moderator from "./moderatorSlice";


export const store=configureStore({
    reducer:{
        
        auth: user,
        // auth1:moderator,
        
        

    },
});