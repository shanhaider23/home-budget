import React from 'react';
import Link from 'next/link';

function BudgetItem({ budget }) {
	const progress = Math.min((budget.totalSpend / budget.amount) * 100, 100);
	// console.log(budget);

	return (
		<Link href={`/dashboard/expenses/${budget.id}`}>
			<div className="p-5 border rounded-lg shadow-lg bg-white hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
				{/* Top Section */}
				<div className="flex items-center justify-between">
					{/* Left Section */}
					<div className="flex items-center gap-4">
						{/* Icon */}
						<div className="text-4xl bg-slate-200 text-slate-600 p-4 rounded-full">
							{budget?.icon}
						</div>

						{/* Name and Item Info */}
						<div>
							<h2 className="text-lg font-semibold text-gray-800">
								{budget.name}
							</h2>

							<p className="text-sm text-gray-500">
								{budget.totalItem} item(s)
							</p>
						</div>
					</div>

					{/* Right Section */}
					<div className="text-right">
						{/* Amount and Remaining */}
						<div className="text-gray-800 font-semibold">
							<p>Spent: ${budget.totalSpend || 0}</p>
							<p className="text-sm text-gray-500">
								Remaining: ${budget.amount - (budget.totalSpend || 0)}
							</p>
						</div>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="mt-4">
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
