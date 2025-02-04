'use client';
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
// import { db } from '@/utils/dbConfig';
// import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
// import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import BudgetItem from './BudgetItem';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudgets } from '@/redux/slices/budgetSlice';

function BudgetList() {
	const { user } = useUser();

	const dispatch = useDispatch();
	const { list: budgetList, loading } = useSelector((state) => state.budgets);

	useEffect(() => {
		if (user) {
			dispatch(fetchBudgets(user.primaryEmailAddress?.emailAddress));
		}
	}, [user, dispatch]);

	return (
		<div className="mt-7">
			<div className="flex items-center justify-between mb-5">
				<h2 className="font-bold text-3xl ">Budgets</h2>
				{/* <CreateBudget refreshData={() => getBudgetList()} /> */}
				<CreateBudget
					refreshData={() =>
						dispatch(fetchBudgets(user.primaryEmailAddress?.emailAddress))
					}
				/>
			</div>
			{loading}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
				{budgetList?.length > 0
					? budgetList.map((budget, i) => (
							<BudgetItem budget={budget} key={budget.id} />
					  ))
					: [1, 2, 3, 4, 5, 6].map((item, i) => (
							<div
								key={i}
								className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
							></div>
					  ))}
			</div>
		</div>
	);
}

export default BudgetList;
