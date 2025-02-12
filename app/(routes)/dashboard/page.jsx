'use client';
import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import CardInfo from './_component/CardInfo';
import BarChartDashboard from './_component/BarChart';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/[id]/_component/ExpenseListTable';
import { fetchBudgets } from '@/redux/slices/budgetSlice';
import { fetchExpenses } from '@/redux/slices/expenseSlice';
import { useSelector, useDispatch } from 'react-redux';

function Dashboard({ params: paramsPromise }) {
	const params = use(paramsPromise);
	const { isSignedIn, user } = useUser();
	const router = useRouter();
	const dispatch = useDispatch();
	const { list: budgetList, loading } = useSelector((state) => state.budgets);
	const {
		list: expenseList,

		error,
	} = useSelector((state) => state.expenses);

	useEffect(() => {
		if (!isSignedIn) {
			router.push('/sign-in');
		} else {
			dispatch(fetchBudgets(user.primaryEmailAddress?.emailAddress));
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
		}
	}, [isSignedIn, user, params.id]);

	return (
		<div className="pl-5 pr-5 pt-5">
			<CardInfo budgetList={budgetList} />

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
				<div className="md:col-span-2 space-y-6 gap-5">
					<BarChartDashboard budgetList={budgetList} />
					<div className="h-[270px] overflow-y-auto overflow-x-hidden">
						<ExpenseListTable />
					</div>
				</div>

				<div className="md:col-span-1 h-[630px] overflow-y-auto overflow-x-hidden pl-5 pr-5">
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
