import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { eq, sql, desc, getTableColumns } from 'drizzle-orm';
import { toast } from 'sonner';

// Fetch budgets from database
export const fetchBudgets = createAsyncThunk('budgets/fetchBudgets', async (email) => {
    try {
        console.log('Fetching budgets for email:', email);
        const results = await db
            .select({
                ...getTableColumns(Budgets),
                totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                totalItem: sql`count(${Expenses.id})`.mapWith(Number),
            })
            .from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, email))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id));

        console.log('Fetched budgets:', results);
        return results;
    } catch (error) {
        console.error('Error fetching budgets:', error);
        throw error;
    }
});


// Create Budget
export const createBudget = createAsyncThunk(
    'budgets/createBudget',
    async ({ name, amount, currency, email, emojiIcon }, { dispatch }) => {
        try {
            const result = await db
                .insert(Budgets)
                .values({
                    name,
                    amount,
                    currency,
                    createdBy: email,
                    icon: emojiIcon,
                })
                .returning({ inserted: Budgets.id });

            if (result) {
                dispatch(fetchBudgets(email)); // Refresh budget list
                toast.success('New Budget Created');
            }
        } catch (error) {
            console.error('Error creating budget:', error);
            toast.error('Failed to create budget. Please try again.');
        }
    }
);

//edit budget

export const editBudget = createAsyncThunk(
    'budgets/editBudget',
    async ({ budgetId, name, amount, emojiIcon, email }, { dispatch }) => {
        try {
            const result = await db
                .update(Budgets)
                .set({
                    name,
                    amount,
                    icon: emojiIcon,
                })
                .where(eq(Budgets.id, budgetId))
                .returning();

            if (result) {
                dispatch(fetchBudgets(email)); // Refresh updated budgets list
                toast.success('Budget Updated');
            }
        } catch (error) {
            console.error('Error editing budget:', error);
            toast.error('Failed to edit budget. Please try again.');
        }
    }
);

export const deleteBudget = createAsyncThunk(
    'budgets/deleteBudget',
    async ({ pramsId, email }, { dispatch }) => {
        try {
            // Delete all related expenses first
            await db
                .delete(Expenses)
                .where(eq(Expenses.budgetId, pramsId))
                .returning();

            // Delete the budget
            const results = await db
                .delete(Budgets)
                .where(eq(Budgets.id, pramsId))
                .returning();

            if (results.length > 0) {
                toast.success('Budget Deleted');
                dispatch(fetchBudgets(email)); // Refresh budgets list
                return results;
            } else {
                throw new Error('Failed to delete budget');
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
            toast.error('Failed to delete budget. Please try again.');
            throw error;
        }
    }
);






const budgetSlice = createSlice({
    name: 'budgets',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createBudget.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBudget.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default budgetSlice.reducer;
