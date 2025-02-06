'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthly } from '@/redux/slices/monthlySlice';
import { useUser } from '@clerk/nextjs';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from 'recharts';
import { Loader } from 'lucide-react';

function MonthlyIncome({ month, year }) {
	const dispatch = useDispatch();
	const { user } = useUser();

	const {
		list: monthlyList,
		loading,
		error,
	} = useSelector((state) => state.monthly);

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchMonthly(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user, month]);

	const filteredList = monthlyList.filter((item) => {
		const itemMonth = new Date(item.date)
			.toLocaleString('default', { month: 'long' })
			.toLowerCase();
		const itemYear = new Date(item.date).getFullYear().toString();
		return (
			item.type === 'income' &&
			(!month || itemMonth === month) &&
			(!year || itemYear === year)
		);
	});

	const incomeData = filteredList.map((item) => ({
		name: item.category,
		value: parseFloat(item.amount),
	}));
	const COLORS = [
		'#0088FE',
		'#00C49F',
		'#FFBB28',
		'#FF8042',
		'#FF5733',
		'#C70039',
	];

	return (
		<div className="mb-7 w-full p-4 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
			<div className="grid grid-cols-1 gap-5">
				<div className="flex flex-col justify-center items-stretch gap-5">
					<div>
						<div className="w-full text-left border-collapse">
							<div className="border shadow-lg bg-green-600 dark:bg-green-800 dark:border-gray-700 flex justify-center items-center text-lg p-2 italic">
								<h1>Income</h1>
							</div>
							<div>
								<ResponsiveContainer width="100%" height={400}>
									<PieChart>
										<Pie
											data={incomeData}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={100}
											fill="#8884d8"
											dataKey="value"
											label={({ name, value }) => `${name}: ${value}`}
										>
											{incomeData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
						<div className="overflow-x-auto">
							{loading ? (
								<div className="flex justify-center items-center p-10">
									<Loader className="animate-spin" size={50} />
								</div>
							) : filteredList.length > 0 ? (
								<table className="w-full text-center border border-gray-200 dark:border-gray-700">
									<tbody>
										{filteredList.map((item, index) => (
											<tr
												key={item.id}
												className="border border-gray-200 dark:border-gray-700 last:border-none hover:bg-gray-100 dark:hover:bg-gray-600 transition"
												style={{
													backgroundColor: COLORS[index % COLORS.length],
												}}
											>
												<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
													{item.category}
												</td>
												<td className="p-3 text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700">
													{item.amount}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<div className="text-center p-10 text-gray-500 dark:text-gray-400">
									No records available
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MonthlyIncome;
