'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/dbConfig';
import { eq, getTableColumns, sql, desc } from 'drizzle-orm';
import { Budgets, Expenses as ExpensesSchema } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import { use } from 'react';
import AddExpense from './_component/AddExpense';
import ExpenseListTable from './_component/ExpenseListTable';

function ExpensesScreen({ params: paramsPromise }) {
	const params = use(paramsPromise);
	const { user } = useUser();
	const [budgetInfo, setBudgetInfo] = useState('');
	const [expensesList, setExpensesList] = useState([]);

	useEffect(() => {
		user && getBudgetInfo(params.id);
	}, [user]);

	const getBudgetInfo = async (budgetId) => {
		const results = await db
			.select({
				...getTableColumns(Budgets),
				totalSpend: sql`sum(${ExpensesSchema.amount})`.mapWith(Number),
				totalItem: sql`sum(${ExpensesSchema.id})`.mapWith(Number),
			})
			.from(Budgets)
			.leftJoin(ExpensesSchema, eq(Budgets.id, ExpensesSchema.budgetId))
			.where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
			.where(eq(Budgets.id, budgetId))
			.groupBy(Budgets.id);
		setBudgetInfo(results[0]);
		getExpenseList(budgetId);
	};

	const getExpenseList = async (budgetId) => {
		const results = await db
			.select()
			.from(ExpensesSchema)
			.where(eq(ExpensesSchema.budgetId, budgetId))
			.orderBy(desc(ExpensesSchema.id));
		setExpensesList(results);
		console.log(results, 'expenses');
	};

	return (
		<div className="p-10">
			<h2 className="text-2xl font-bold"> My Expenses</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
				{budgetInfo ? (
					<BudgetItem budget={budgetInfo} />
				) : (
					<div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
				)}{' '}
				<AddExpense
					budgetId={params.id}
					user={user}
					refreshData={() => getBudgetInfo()}
				/>
			</div>
			<div className="mt-5">
				<h2 className="text-2xl font-bold"> Latest Expenses </h2>
				<ExpenseListTable expensesList={expensesList} />
			</div>
		</div>
	);
}

export default ExpensesScreen;
