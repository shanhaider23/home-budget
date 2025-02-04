'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import { useUser } from '@clerk/nextjs';
import ExpenseListTable from './[id]/_component/ExpenseListTable';
import PiChart from './-component/PiChart';
import TriangleChart from './-component/TriangleChart';

function ExpenseComponent({ params }) {
	const dispatch = useDispatch();
	const { user } = useUser();

	// Get expenses state from Redux
	const {
		list: expenseList,
		loading,
		error,
	} = useSelector((state) => state.expenses);

	// Fetch expenses when user or params.id changes
	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user, params.id]);

	// Show loading state
	if (loading) {
		return <div>Loading data...</div>;
	}

	// Show error state
	if (error) {
		return <div>Error: {error}</div>;
	}

	// Show no data message
	if (!expenseList || expenseList.length === 0) {
		return <div>No expenses found.</div>;
	}

	return (
		<div className="m-5 flex justify-center items-center flex-col gap-5">
			<div className="flex flex-wrap md:flex-nowrap justify-center items-center w-full gap-5">
				<div className="w-full md:w-[50%] p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 rounded-lg">
					<PiChart expensesList={expenseList} />
				</div>
				<div className="w-full md:w-[50%] p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 rounded-lg">
					<h2>Bar chart</h2>
					<TriangleChart />
				</div>
			</div>

			<div className="w-full">
				<ExpenseListTable
					refreshData={() =>
						dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress))
					}
				/>
			</div>
		</div>
	);
}

export default ExpenseComponent;
