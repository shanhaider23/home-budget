import React from 'react';
import Link from 'next/link';

function BudgetItem({ budget, expensesList }) {
	const progress = Math.min((budget.totalSpend / budget.amount) * 100, 100);
	console.log(budget);

	return (
		<Link href={`/dashboard/expenses/${budget.id}`}>
			<div className="p-5 border rounded-lg shadow-lg bg-white hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className=" bg-slate-200 text-slate-600 p-1 rounded-full">
							{budget?.icon}
						</div>

						<div>
							<h2 className="text-lg font-semibold text-gray-800">
								{budget.name}
							</h2>

							<p className="text-sm text-gray-500">
								{`${
									(
										expensesList?.filter(
											(expense) => expense.budgetId === budget.id
										) || []
									).length
								} 
  ${
		(expensesList?.filter((expense) => expense.budgetId === budget.id) || [])
			.length === 1
			? 'item'
			: 'items'
	}`}
							</p>
						</div>
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
							{budget.amount}
							<p className=" text-sm text-gray-500">{budget.currency}</p>
						</h2>
					</div>
				</div>

				<div className="text-gray-800 font-semibold flex items-center justify-between mt-5">
					<p className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
						Spent:
						<span>
							{budget.totalSpend || 0}
							{budget.currency}
						</span>
					</p>
					<p className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
						Remaining:
						<span>
							{budget.amount - (budget.totalSpend || 0)}
							{budget.currency}
						</span>
					</p>
				</div>

				<div>
					<div className="relative h-3 rounded-full bg-gray-200">
						<div
							className="absolute top-0 left-0 h-3 rounded-full bg-blue-500 transition-all"
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<p className="text-sm text-gray-600 mt-1 text-center">
						{progress.toFixed(0)}% used
					</p>
				</div>
			</div>
		</Link>
	);
}

export default BudgetItem;
