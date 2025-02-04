'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import { useUser } from '@clerk/nextjs';
import ExpenseListTable from './[id]/_component/ExpenseListTable';
import PiChart from './-component/PiChart';
import { Loader } from 'lucide-react';

function ExpenseComponent({ params }) {
	const dispatch = useDispatch();
	const { user } = useUser();

	// Get expenses state from Redux
	const {
		list: expenseList,
		loading,
		error,
	} = useSelector((state) => state.expenses);

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user, params.id]);

	if (loading) {
		return (
			<div>
				<Loader />
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!expenseList || expenseList.length === 0) {
		return <div>No expenses found.</div>;
	}

	return (
		<div className="m-5 flex justify-center items-center flex-col gap-5">
			<div className=" p-4 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
				<PiChart expensesList={expenseList} />
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
