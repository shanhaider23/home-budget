import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import dayjs from 'dayjs';
function PiChartDashboard({ monthlyList }) {
	if (!monthlyList || monthlyList.length === 0) {
		return (
			<div className="bg-card h-full flex justify-center items-center flex-col p-4">
				<h2 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-5">
					No Data Available
				</h2>
			</div>
		);
	}

	// Get current month and filter expenses for the current month
	const currentMonth = dayjs().format('YYYY-MM');

	const filteredData = monthlyList.filter(
		(item) => dayjs(item.date).format('YYYY-MM') === currentMonth
	);

	if (filteredData.length === 0) {
		return (
			<div className="bg-card h-full flex justify-center items-center flex-col p-4">
				<h2 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-5">
					No Expenses for {dayjs().format('MMMM')}
				</h2>
			</div>
		);
	}

	// Calculate total income and total expenses
	const totalIncome = filteredData
		.filter((item) => item.type === 'income')
		.reduce((sum, item) => sum + Number(item.amount), 0);

	const totalExpenses = filteredData
		.filter((item) => item.type === 'expense')
		.reduce((sum, item) => sum + Number(item.amount), 0);

	const expensePercentage = totalIncome
		? Math.round((totalExpenses / totalIncome) * 100)
		: 0;
	const expenseCategories = filteredData
		.filter((item) => item.type === 'expense')
		.reduce((acc, item) => {
			if (!acc[item.category]) {
				acc[item.category] = 0;
			}
			acc[item.category] += Number(item.amount);

			return acc;
		}, {});

	const data = Object.entries(expenseCategories).map(([category, amount]) => ({
		name: category,
		value: Number(((amount / totalIncome) * 100).toFixed(3)), // Convert to percentage of total income
	}));

	console.log('📊 Final PieChart Data:', data);

	// const data = [
	// 	{ name: 'Group A', value: 10 },
	// 	{ name: 'Group B', value: 300 },
	// 	{ name: 'Group C', value: 300 },
	// 	{ name: 'Group D', value: 200 },
	// 	{ name: 'Group D', value: 200 },
	// 	{ name: 'Group D', value: 200 },
	// 	{ name: 'Group D', value: 200 },
	// 	{ name: 'Group D', value: 200 },
	// 	{ name: 'Group D', value: 200 },
	// ];
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
	return (
		<div className="bg-card h-full flex justify-center items-center flex-col ">
			<div>
				<h2 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-5">
					{dayjs().format('MMMM')} Activity
				</h2>
			</div>
			<div className="relative w-64 h-64">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={70}
							outerRadius={90}
							paddingAngle={5}
							dataKey="value"
							isAnimationActive={true} // Prevents animation issues
						>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: '#fff',
								borderRadius: '8px',
								padding: '5px',
								border: '1px solid #ddd',
							}}
							formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
						/>
					</PieChart>
				</ResponsiveContainer>

				{/* Center Text */}
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-xl font-bold text-gray-800 dark:text-gray-200">
						{expensePercentage}%
					</span>
					<span className="text-sm text-gray-600 dark:text-gray-400">
						Spent
					</span>
				</div>
			</div>
		</div>
	);
}

export default PiChartDashboard;
