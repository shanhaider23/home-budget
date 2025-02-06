import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from '../redux/slices/budgetSlice';
import expenseReducer from '../redux/slices/expenseSlice';
import monthlyReducer from '../redux/slices/monthlySlice'

export const store = configureStore({
    reducer: {
        budgets: budgetReducer,
        expenses: expenseReducer,
        monthly: monthlyReducer
    },
});