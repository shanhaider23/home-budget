import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from '../redux/slices/budgetSlice';
import expenseReducer from '../redux/slices/expenseSlice';

export const store = configureStore({
    reducer: {
        budgets: budgetReducer,
        expenses: expenseReducer,
    },
});