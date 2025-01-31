import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PiChart({ expensesList }) {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: 'Amount by Category',
				data: [],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			},
		],
	});

	// Update the chart data when expensesList changes
	useEffect(() => {
		if (expensesList.length > 0) {
			// Aggregate amounts by category
			const aggregatedData = expensesList.reduce((acc, transaction) => {
				if (acc[transaction.category]) {
					acc[transaction.category] += transaction.amount;
				} else {
					acc[transaction.category] = transaction.amount;
				}
				return acc;
			}, {});

			// Prepare chart data
			const newData = {
				labels: Object.keys(aggregatedData), // Categories as labels
				datasets: [
					{
						label: 'Amount by Category',
						data: Object.values(aggregatedData), // Sum of amounts for each category
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(255, 206, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(255, 159, 64, 0.2)',
						],
						borderColor: [
							'rgba(255, 99, 132, 1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)',
						],
						borderWidth: 1,
					},
				],
			};
			setChartData(newData); // Update the chart data
		}
	}, [expensesList]); // Re-run when expensesList changes

	// Show a loading message if expensesList is empty
	if (expensesList.length === 0) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full flex justify-center items-center">
			<Pie data={chartData} />
		</div>
	);
}

export default PiChart;
