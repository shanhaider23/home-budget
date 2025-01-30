'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

import { db } from '@/utils/dbConfig';
import { eq, getTableColumns, sql, desc } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import CardInfo from './_component/CardInfo';
import BarChartDashboard from './_component/BarChart';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/[id]/_component/ExpenseListTable';

function Dashboard({ params: paramsPromise }) {
	const params = use(paramsPromise);
	const { isSignedIn, user } = useUser();
	const [budgetList, setBudgetList] = useState([]);
	const [expenseList, setExpenseList] = useState([]);
	const router = useRouter();

	useEffect(() => {
		if (!isSignedIn) {
			// Redirect to sign-in page if user is not signed in
			router.push('/sign-in');
		} else {
			getBudgetList(params.id);
		}
	}, [isSignedIn, user, params.id]);

	const refreshData = () => {
		getBudgetList(params.id);
	};
	const getBudgetList = async () => {
		const results = await db
			.select({
				...getTableColumns(Budgets),
				totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
				totalItem: sql`sum(${Expenses.id})`.mapWith(Number),
			})
			.from(Budgets)
			.leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
			.where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
			.groupBy(Budgets.id)
			.orderBy(desc(Budgets.id));
		setBudgetList(results);
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
		<div className="p-5">
			<CardInfo budgetList={budgetList} />

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
				<div className="md:col-span-2 space-y-6 gap-5">
					<BarChartDashboard budgetList={budgetList} />
					<ExpenseListTable
						expensesList={expenseList}
						refreshData={refreshData}
					/>
				</div>

				<div className="md:col-span-1">
					<h2 className="font-bold text-2xl mb-4">Latest Budgets</h2>
					<div className="space-y-4 grid gap-5">
						{budgetList.map((budget, i) => (
							<BudgetItem budget={budget} key={i} expensesList={expenseList} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
