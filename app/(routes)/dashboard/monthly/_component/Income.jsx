'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthly } from '@/redux/slices/monthlySlice';
import { useUser } from '@clerk/nextjs';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { Loader } from 'lucide-react';

const data = [
	{ name: 'Group A', value: 400 },
	{ name: 'Group B', value: 300 },
	{ name: 'Group C', value: 300 },
	{ name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};
function MonthlyIncome({ month }) {
	const dispatch = useDispatch();
	const { user } = useUser();

	const {
		list: monthlyList,
		loading,
		error,
	} = useSelector((state) => state.monthly);

	useEffect(() => {
		console.log('month');
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchMonthly(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user, month]);

	const filteredList = monthlyList.filter((item) => {
		const itemMonth = new Date(item.date)
			.toLocaleString('default', { month: 'long' })
			.toLowerCase();
		const itemYear = new Date(item.date).getFullYear().toString();

		return !month || itemMonth === month;
	});

	return (
		<div className="mb-7 w-full p-4 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
			<div className="grid grid-cols-1 grid-rows-[35%, 65% ]  gap-5">
				<div className="flex flex-col justify-center items-stretch gap-5">
					<div>
						<div className="w-full text-left border-collapse">
							<div className="border  shadow-lg bg-green-600 dark:bg-green-800 dark:border-gray-700 flex justify-center items-center text-lg p-2 italic">
								<h1>Income </h1>
							</div>
							<div>
								<ResponsiveContainer width="100%" height={400}>
									<PieChart width={400} height={400}>
										<Pie
											data={data}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={renderCustomizedLabel}
											outerRadius={80}
											fill="#8884d8"
											dataKey="value"
										>
											{data.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-gray-800 shadow-md  overflow-hidden border border-gray-200 dark:border-gray-700">
						<div className="overflow-x-auto">
							{loading ? (
								<div className="flex justify-center items-center p-10">
									<Loader className="animate-spin" size={50} />
								</div>
							) : filteredList.length > 0 ? (
								<table className="w-full text-left border-collapse">
									<tbody>
										{filteredList.map((item) => (
											<tr
												key={item.id}
												className="border-b last:border-none hover:bg-gray-100 dark:hover:bg-gray-600 transition"
											>
												<td className={`p-3 text-gray-800 dark:text-gray-200 `}>
													{item.type === 'income' && <p>{item.category}</p>}
												</td>
												<td className={`p-3 text-gray-800 dark:text-gray-200 `}>
													{item.type === 'income' && <p>{item.amount}</p>}
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
				<div className="border border-gray-200 dark:border-gray-700"></div>
			</div>
		</div>
	);
}

export default MonthlyIncome;
