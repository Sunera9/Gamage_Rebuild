import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../src/redux/authslice'; // Adjust the path as per your project structure

const store = configureStore({
    reducer: {
        auth: authSlice,
        // Add other reducers here
    },
});

export default store;
