import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

function Welcome({ budgetList }) {
	const { user } = useUser();
	const [totalBudget, setTotalBudget] = useState(0);
	const [totalSpend, setTotalSpend] = useState(0);
	const [currency, setCurrency] = useState('$');
	useEffect(() => {
		console.log('setTotalSpend', budgetList.currency);
		if (budgetList) {
			CalculateCardInfo();
		}
	}, [budgetList]);

	const CalculateCardInfo = () => {
		let total_budget = 0;
		let total_spend = 0;
		budgetList.forEach((budget) => {
			setCurrency(budget.currency);
			total_budget += Number(budget.amount);
			total_spend += budget.totalSpend;
		});
		setTotalBudget(total_budget);
		setTotalSpend(total_spend);
	};
	const progress = Math.min((totalSpend / totalBudget) * 100, 100);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-[60%_40%]  bg-card h-full ">
			{/* Left Content (70%) */}
			<div className="flex flex-col justify-around ">
				<div className="flex justify-start items-center gap-5 pl-10 ">
					<UserButton />
					<div>
						<p>Welcome back</p>
						<h1 className="text-3xl font-semibold">{user?.fullName}!</h1>
					</div>
				</div>

				<div>
					{budgetList ? (
						<div className="flex justify-start items-center pl-10  ">
							<div className="pr-14 border-r-2">
								<div className="flex gap-2 justify-end items-center">
									<h1 className="text-5xl text-gray-900 dark:text-gray-100 pb-2">
										{totalBudget}
									</h1>
									<p className="text-lg">{currency}</p>
								</div>
								<h2 className="text-gray-700 dark:text-gray-200 font-semibold lg:text-lg sm:text-sm">
									Total Budget
								</h2>
							</div>

							<div className="pl-14">
								<div className="flex gap-2 justify-end items-center">
									<h2 className="text-5xl text-gray-900 dark:text-gray-100 pb-2">
										{totalSpend}
									</h2>
									<p className="text-lg">{currency}</p>
								</div>
								<h2 className="text-gray-700 dark:text-gray-200 font-semibold lg:text-lg sm:text-sm">
									Total Spend
								</h2>
							</div>
						</div>
					) : (
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
				<div className="w-[50%] ml-10 ">
					<div className="relative h-3 rounded-full bg-gray-200 dark:bg-gray-600">
						<div
							className="absolute top-0 left-0 h-3 rounded-full bg-green-500 transition-all"
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<p className="text-sm text-gray-600 mt-1 text-center dark:text-gray-300">
						{progress.toFixed(0)}% used
					</p>
				</div>
			</div>

			{/* Right Image Column (30%) - Hidden on Mobile */}
			<div className="hidden sm:flex h-full justify-end items-end pr-10">
				<Image
					src="/welcome.png"
					alt="Logo"
					width={250}
					height={200}
					layout="intrinsic"
				/>
			</div>
		</div>
	);
}

export default Welcome;
