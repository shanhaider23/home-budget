'use client';
import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import { deleteBudget, fetchBudgets } from '@/redux/slices/budgetSlice';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_component/AddExpense';
import ExpenseListTable from './_component/ExpenseListTable';
import EditBudget from './_component/EditBudget';
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

function ExpensesScreen({ params: paramsPromise }) {
	const params = use(paramsPromise);
	const dispatch = useDispatch();
	const router = useRouter();
	const { user } = useUser();

	// Get Redux state
	const {
		list: expensesList,
		loading: expensesLoading,
		error: expensesError,
	} = useSelector((state) => state.expenses);
	const {
		list: budgetList,
		loading: budgetLoading,
		error: budgetError,
	} = useSelector((state) => state.budgets);

	// Find the specific budget based on params.id
	const budgetInfo = budgetList.find(
		(budget) => budget.id === parseInt(params.id, 10)
	);

	// Fetch budgets & expenses on mount
	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchBudgets(user.primaryEmailAddress.emailAddress)).then(() => {
				dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
			});
		}
	}, [dispatch, user, params.id]);

	// Refresh function
	const refreshData = () => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchBudgets(user.primaryEmailAddress.emailAddress));
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
		}
	};

	// Handle budget deletion
	const deleteBudgetHandler = () => {
		dispatch(
			deleteBudget({
				pramsId: params.id,
				email: user.primaryEmailAddress.emailAddress,
			})
		).then(() => router.replace('/dashboard/budgets'));
	};

	// Show loading state
	if (budgetLoading || expensesLoading) {
		return (
			<div className="text-center text-gray-600 dark:text-gray-300">
				Loading data...
			</div>
		);
	}

	// Show error state
	if (budgetError || expensesError) {
		return (
			<div className="text-center text-red-500">
				Error: {budgetError || expensesError}
			</div>
		);
	}
	// Filter expenses based on the selected budget
	const filteredExpenses = expensesList.filter(
		(expense) => expense.budgetId === parseInt(params.id, 10)
	);

	return (
		<div className="p-10">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">My Expenses</h2>
				<div className="flex gap-2 items-center">
					<EditBudget budgetInfo={budgetInfo} refreshData={refreshData} />
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
								<AlertDialogAction onClick={deleteBudgetHandler}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			{/* Budget Info Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
				{budgetInfo ? (
					<BudgetItem budget={budgetInfo} expensesList={expensesList} />
				) : (
					<div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
				)}
				<AddExpense budgetId={params.id} refreshData={refreshData} />
			</div>

			{/* Expenses List Section */}
			<div className="mt-5">
				<p>{expensesList.budgetId}</p>
				<h2 className="text-2xl font-bold mb-4">Latest Expenses</h2>
				<ExpenseListTable budgetId={params.id} />
			</div>
		</div>
	);
}

export default ExpensesScreen;
