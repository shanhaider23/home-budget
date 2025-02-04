import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/utils/dbConfig';
import { Expenses, Budgets } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import moment from 'moment';
import { toast } from 'sonner';

// Fetch expenses from database
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (email) => {
  const results = await db
    .select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      category: Expenses.category,
      createdAt: Expenses.createdAt,
      budgetId: Expenses.budgetId
    })
    .from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .orderBy(desc(Expenses.id));

  return results;
});

// Add New Expense
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async ({ name, amount, budgetId, category }, { dispatch }) => {
    try {
      const result = await db
        .insert(Expenses)
        .values({
          name,
          amount,
          budgetId,
          createdAt: moment().format('DD/MM/YYYY'),
          category,
        })
        .returning({ inserted: Expenses.id });

      if (result) {
        dispatch(fetchExpenses(budgetId)); // Refresh expense list
        toast.success('New Expense Added');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
    }
  }
);

// Delete Expense
export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async ({ expenseId, email }, { dispatch }) => {
  try {
    await db.delete(Expenses).where(eq(Expenses.id, expenseId)).returning();
    toast.success('Expense Deleted');

    // Refresh expenses after deletion
    dispatch(fetchExpenses(email));
  } catch (error) {
    console.error('Error deleting expense:', error);
    toast.error('Failed to delete expense. Please try again.');
  }
});

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpense.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default expenseSlice.reducer;
