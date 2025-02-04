import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { eq, sql, desc, getTableColumns } from 'drizzle-orm';
import { toast } from 'sonner';

// **Fetch budgets from database**
export const fetchBudgets = createAsyncThunk('budgets/fetchBudgets', async (email) => {
    try {
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

        return results;
    } catch (error) {
        console.error('Error fetching budgets:', error);
        throw error;
    }
});

// **Create Budget**
export const createBudget = createAsyncThunk(
    'budgets/createBudget',
    async ({ name, amount, currency, email, emojiIcon }) => {
        try {
            const [newBudget] = await db
                .insert(Budgets)
                .values({
                    name,
                    amount,
                    currency,
                    createdBy: email,
                    icon: emojiIcon,
                })
                .returning({
                    id: Budgets.id,
                    name: Budgets.name,
                    amount: Budgets.amount,
                    currency: Budgets.currency,
                    createdBy: Budgets.createdBy,
                    icon: Budgets.icon,
                });

            if (newBudget) {
                toast.success('New Budget Created');
                return newBudget; // 🔹 Return the new budget to update Redux state instantly
            }
        } catch (error) {
            console.error('Error creating budget:', error);
            toast.error('Failed to create budget. Please try again.');
            throw error;
        }
    }
);

// **Edit Budget**
export const editBudget = createAsyncThunk(
    'budgets/editBudget',
    async ({ budgetId, name, amount, emojiIcon }) => {
        try {
            const [updatedBudget] = await db
                .update(Budgets)
                .set({
                    name,
                    amount,
                    icon: emojiIcon,
                })
                .where(eq(Budgets.id, budgetId))
                .returning();

            if (updatedBudget) {
                toast.success('Budget Updated');
                return updatedBudget; // 🔹 Return updated budget to update Redux state instantly
            }
        } catch (error) {
            console.error('Error editing budget:', error);
            toast.error('Failed to edit budget. Please try again.');
            throw error;
        }
    }
);

// **Delete Budget**
export const deleteBudget = createAsyncThunk(
    'budgets/deleteBudget',
    async ({ paramsId, email }) => {
        try {
            // Delete all related expenses first
            await db.delete(Expenses).where(eq(Expenses.budgetId, paramsId));

            // Delete the budget
            const deletedBudget = await db
                .delete(Budgets)
                .where(eq(Budgets.id, paramsId))
                .returning();

            if (deletedBudget.length > 0) {
                toast.success('Budget Deleted');
                return paramsId; // 🔹 Return deleted budget ID to remove from Redux state
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
            // **Fetch Budgets**
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

            // **Create Budget (Instant State Update)**
            .addCase(createBudget.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBudget.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload) {
                    state.list.unshift(action.payload); // ✅ Add new budget instantly
                }
            })
            .addCase(createBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // **Edit Budget (Update State)**
            .addCase(editBudget.pending, (state) => {
                state.loading = true;
            })
            .addCase(editBudget.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload) {
                    state.list = state.list.map((budget) =>
                        budget.id === action.payload.id ? action.payload : budget
                    ); // ✅ Update the edited budget instantly
                }
            })
            .addCase(editBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // **Delete Budget (Remove from State)**
            .addCase(deleteBudget.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((budget) => budget.id !== action.payload); // ✅ Remove deleted budget instantly
            })
            .addCase(deleteBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default budgetSlice.reducer;
