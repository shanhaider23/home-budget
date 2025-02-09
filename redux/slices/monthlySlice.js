import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/utils/dbConfig';
import { Monthly } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import moment from 'moment';
import { toast } from 'sonner';

// **Fetch Monthly Data from Database**
export const fetchMonthly = createAsyncThunk(
    'monthly/fetchMonthly',
    async () => {
        const results = await db
            .select({
                id: Monthly.id,
                date: Monthly.date,
                type: Monthly.type,
                category: Monthly.category,
                amount: Monthly.amount,
            })
            .from(Monthly)
            .orderBy(desc(Monthly.id));
        return results;
    }
);

// **Add New Monthly Record**
export const addMonthly = createAsyncThunk(
    'monthly/addMonthly',
    async ({ date, type, category, amount }, { dispatch }) => {
        try {
            const [newMonthly] = await db
                .insert(Monthly)
                .values({
                    date: date || moment().format('DD-MM-YYYY'),
                    type,
                    category,
                    amount,
                })
                .returning({
                    id: Monthly.id,
                    date: Monthly.date,
                    type: Monthly.type,
                    category: Monthly.category,
                    amount: Monthly.amount,
                });

            if (newMonthly) {
                toast.success('New Monthly Record Added');
                return newMonthly;
            }
        } catch (error) {
            console.error('Error adding monthly record:', error);
            toast.error('Failed to add record. Please try again.');
            throw error;
        }
    }
);

// **Delete Monthly Record**
export const deleteMonthly = createAsyncThunk(
    'monthly/deleteMonthly',
    async ({ monthlyId }, { dispatch }) => {
        try {
            await db.delete(Monthly).where(eq(Monthly.id, monthlyId)).returning();
            toast.success('Monthly Record Deleted');
            dispatch(fetchMonthly());
            return monthlyId;
        } catch (error) {
            console.error('Error deleting monthly record:', error);
            toast.error('Failed to delete record. Please try again.');
            throw error;
        }
    }
);
export const updateMonthly = createAsyncThunk(
    "monthly/updateMonthly",
    async ({ id, amount, category }) => {
        const updatedRecord = await db.update(Monthly)
            .set({ amount, category })
            .where(eq(Monthly.id, id))
            .returning(); // Ensure it returns the updated row
        return updatedRecord[0]; // Return the updated record
    }
);


const monthlySlice = createSlice({
    name: 'monthly',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonthly.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMonthly.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchMonthly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addMonthly.pending, (state) => {
                state.loading = true;
            })
            .addCase(addMonthly.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.list.unshift(action.payload);
                }
            })
            .addCase(addMonthly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteMonthly.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteMonthly.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((record) => record.id !== action.payload);
            })
            .addCase(deleteMonthly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateMonthly.fulfilled, (state, action) => {
                state.list = state.list.map((monthly) =>
                    monthly.id === action.payload.id ? { ...monthly, amount: action.payload.amount } : monthly
                );
            });
    },
});

export default monthlySlice.reducer;
