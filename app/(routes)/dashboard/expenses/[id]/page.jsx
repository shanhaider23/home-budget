'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/dbConfig';
import { eq, getTableColumns, sql, desc } from 'drizzle-orm';
import { Budgets, Expenses as ExpensesSchema } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import { use } from 'react';
import AddExpense from './_component/AddExpense';
import ExpenseListTable from './_component/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import EditBudget from './_component/EditBudget';

function ExpensesScreen({ params: paramsPromise }) {
	const params = use(paramsPromise);
	const { user } = useUser();
	const [budgetInfo, setBudgetInfo] = useState('');
	const [expensesList, setExpensesList] = useState([]);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			getBudgetInfo(params.id);
		}
	}, [user, params.id]);
	const refreshData = () => {
		getBudgetInfo(params.id);
	};
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
		setExpensesList([...results]);
	};

	const deleteBudget = async () => {
		const deleteExpenseResult = await db
			.delete(ExpensesSchema)
			.where(eq(ExpensesSchema.budgetId, params.id))
			.returning();
		if (deleteExpenseResult) {
			const results = await db
				.delete(Budgets)
				.where(eq(Budgets.id, params.id))
				.returning();
		}
		toast('Budget Deleted!');
		router.replace('/dashboard/budgets');
	};

	return (
		<div className="p-10">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold"> My Expenses</h2>
				<div className="flex gap-2 items-center">
					<EditBudget
						budgetInfo={budgetInfo}
						refreshData={() => getBudgetInfo()}
					/>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button className="flex gap-2" variant="destructive">
								Delete
								<Trash />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your current budget along with your expenses.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => deleteBudget()}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
				{budgetInfo ? (
					<BudgetItem budget={budgetInfo} expensesList={expensesList} />
				) : (
					<div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
				)}{' '}
				<AddExpense
					budgetId={params.id}
					user={user}
					refreshData={refreshData}
				/>
			</div>
			<div className="mt-5">
				<h2 className="text-2xl font-bold"> Latest Expenses </h2>
				<ExpenseListTable
					expensesList={expensesList}
					refreshData={refreshData}
				/>
			</div>
		</div>
	);
}

export default ExpensesScreen;
