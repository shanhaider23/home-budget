import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function CardInfo({ budgetList }) {
	const [totalBudget, setTotalBudget] = useState(0);
	const [totalSpend, setTotalSpend] = useState(0);

	useEffect(() => {
		if (budgetList) {
			CalculateCardInfo();
		}
	}, [budgetList]);

	const CalculateCardInfo = () => {
		let total_budget = 0;
		let total_spend = 0;
		budgetList.forEach((budget) => {
			total_budget += Number(budget.amount);
			total_spend += budget.totalSpend;
		});
		setTotalBudget(total_budget);
		setTotalSpend(total_spend);
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
			{budgetList ? (
				<>
					{/* Number of Budgets Card */}
					<div className="p-6 bg-green-100 dark:bg-green-800 border-l-4 border-green-500 dark:border-green-600 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-all flex-wrap">
						<div className="bg-green-500 text-white p-4 rounded-full">
							<Wallet size={32} />
						</div>
						<div>
							<h2 className="text-gray-700 dark:text-gray-200 font-semibold lg:text-lg  sm:text-sm">
								No. of Budgets
							</h2>
							<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
								{budgetList.length}
							</h2>
						</div>
					</div>
					{/* Total Budget Card */}
					<div className="p-6 bg-blue-100 dark:bg-blue-800 border-l-4 border-blue-500 dark:border-blue-600 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-all flex-wrap ">
						<div className="bg-blue-500 text-white p-4 rounded-full">
							<PiggyBank size={32} />
						</div>
						<div>
							<h2 className="text-gray-700 dark:text-gray-200 font-semibold lg:text-lg sm:text-sm">
								Total Budget
							</h2>
							<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
								{totalBudget}
							</h2>
						</div>
					</div>

					{/* Total Spend Card */}
					<div className="p-6 bg-red-100 dark:bg-red-800 border-l-4 border-red-500 dark:border-red-600 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-all flex-wrap">
						<div className="bg-red-500 text-white p-4 rounded-full">
							<ReceiptText size={32} />
						</div>
						<div>
							<h2 className="text-gray-700 dark:text-gray-200 font-semibold lg:text-lg sm:text-sm">
								Total Spend
							</h2>
							<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
								{totalSpend}
							</h2>
						</div>
					</div>
				</>
			) : (
				// Skeleton Loading
				<div className="flex gap-6 w-full">
					{[1, 2, 3].map((item, i) => (
						<div
							key={i}
							className="h-[120px] w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"
						></div>
					))}
				</div>
			)}
		</div>
	);
}

export default CardInfo;
