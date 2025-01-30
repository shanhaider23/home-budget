'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/dbConfig';
import { eq, getTableColumns, sql, desc } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import ExpenseListTable from './[id]/_component/ExpenseListTable';
import PiChart from './-component/PiChart';

function ExpenseComponent({ params: paramsPromise }) {
	const params = use(paramsPromise);
	const { user } = useUser();
	const [expenseList, setExpenseList] = useState([]);
	useEffect(() => {
		getAllExpenses();
	}, [user, params.id]);

	const refreshData = () => {
		getAllExpenses();
	};

	const getAllExpenses = async () => {
		const results = await db
			.select({
				id: Expenses.id,
				name: Expenses.name,
				amount: Expenses.amount,
				category: Expenses.category,
				createdAt: Expenses.createdAt,
			})
			.from(Budgets)
			.rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
			.where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
			.orderBy(desc(Expenses.id));
		setExpenseList(results);
	};
	return (
		<div className="m-5">
			<ExpenseListTable expensesList={expenseList} refreshData={refreshData} />
			<PiChart />
		</div>
	);
}

export default ExpenseComponent;
