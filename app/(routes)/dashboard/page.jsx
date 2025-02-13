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
import { fetchMonthly } from '@/redux/slices/monthlySlice';
import { useSelector, useDispatch } from 'react-redux';
import Welcome from './_component/Welcome';
import PiChartDashboard from './_component/PiChartDashboard';

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
	const { list: monthlyList } = useSelector((state) => state.monthly);

	useEffect(() => {
		if (!isSignedIn) {
			router.push('/sign-in');
		} else {
			dispatch(fetchBudgets(user.primaryEmailAddress?.emailAddress));
			dispatch(fetchExpenses(user.primaryEmailAddress.emailAddress));
			dispatch(fetchMonthly(user.primaryEmailAddress.emailAddress));
		}
	}, [isSignedIn, user, params.id]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-[repeat(6,1fr)] grid-rows-[repeat(5,250px)] gap-5 pl-5 pr-5 pt-5">
			<div className="col-span-4">
				<Welcome budgetList={budgetList} />
			</div>
			<div>
				<CardInfo budgetList={budgetList} />
			</div>
			<div>
				<CardInfo budgetList={budgetList} />
			</div>
			<div className="col-span-2 row-span-2 gap-5">
				<BarChartDashboard budgetList={budgetList} />
			</div>
			<div className="col-span-2 row-span-2 gap-5">
				<PiChartDashboard monthlyList={monthlyList} />
			</div>

			<div className="col-span-2 row-span-2 overflow-y-auto overflow-x-hidden ">
				<h2 className="font-bold text-2xl mb-4">Latest Budgets</h2>
				<div className="grid grid-cols-2 gap-5 mr-5">
					{budgetList.map((budget, i) => (
						<BudgetItem budget={budget} key={i} expensesList={expenseList} />
					))}
				</div>
			</div>
			<div className=" overflow-y-auto overflow-x-hidden">
				<ExpenseListTable />
			</div>
		</div>
	);
}

export default Dashboard;
