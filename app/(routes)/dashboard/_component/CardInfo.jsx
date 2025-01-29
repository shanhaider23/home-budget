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
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{budgetList ? (
				<>
					{/* Total Budget Card */}
					<div className="p-6 bg-blue-100 border-l-4 border-blue-500 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
						<div className="bg-blue-500 text-white p-4 rounded-full">
							<PiggyBank size={32} />
						</div>
						<div>
							<h2 className="text-gray-700 font-semibold text-lg">
								Total Budget
							</h2>
							<h2 className="text-xl font-bold text-gray-900">
								${totalBudget}
							</h2>
						</div>
					</div>

					{/* Total Spend Card */}
					<div className="p-6 bg-red-100 border-l-4 border-red-500 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
						<div className="bg-red-500 text-white p-4 rounded-full">
							<ReceiptText size={32} />
						</div>
						<div>
							<h2 className="text-gray-700 font-semibold text-lg">
								Total Spend
							</h2>
							<h2 className="text-xl font-bold text-gray-900">${totalSpend}</h2>
						</div>
					</div>

					{/* Number of Budgets Card */}
					<div className="p-6 bg-green-100 border-l-4 border-green-500 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
						<div className="bg-green-500 text-white p-4 rounded-full">
							<Wallet size={32} />
						</div>
						<div>
							<h2 className="text-gray-700 font-semibold text-lg">
								Number of Budgets
							</h2>
							<h2 className="text-xl font-bold text-gray-900">
								{budgetList.length}
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
							className="h-[120px] w-full bg-slate-200 animate-pulse rounded-lg"
						></div>
					))}
				</div>
			)}
		</div>
	);
}

export default CardInfo;
