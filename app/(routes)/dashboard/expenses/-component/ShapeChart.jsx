import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Loader } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

function PiChart({ expensesList }) {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: 'Amount by Category',
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
			},
		],
	});
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Detect dark or light mode
	useEffect(() => {
		const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
		setIsDarkMode(darkModeQuery.matches);

		darkModeQuery.addEventListener('change', (e) => {
			setIsDarkMode(e.matches);
		});
	}, []);

	// Define light and dark color schemes
	const lightColors = [
		'rgba(255, 99, 132, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
		'rgba(153, 102, 255, 0.2)',
		'rgba(255, 159, 64, 0.2)',
	];
	const darkColors = [
		'rgba(255, 99, 132, 0.8)',
		'rgba(54, 162, 235, 0.8)',
		'rgba(255, 206, 86, 0.8)',
		'rgba(75, 192, 192, 0.8)',
		'rgba(153, 102, 255, 0.8)',
		'rgba(255, 159, 64, 0.8)',
	];

	// Update the chart data when expensesList changes
	useEffect(() => {
		if (expensesList.length > 0) {
			const aggregatedData = expensesList.reduce((acc, transaction) => {
				if (acc[transaction.category]) {
					acc[transaction.category] += transaction.amount;
				} else {
					acc[transaction.category] = transaction.amount;
				}
				return acc;
			}, {});

			const newData = {
				labels: Object.keys(aggregatedData), // Categories as labels
				datasets: [
					{
						label: 'Amount by Category',
						data: Object.values(aggregatedData), // Sum of amounts for each category
						backgroundColor: isDarkMode ? darkColors : lightColors, // Choose colors based on the theme
						borderColor: isDarkMode
							? darkColors.map((color) => color.replace('0.8', '1'))
							: lightColors.map((color) => color.replace('0.2', '1')), // Make border more visible in dark mode
						borderWidth: 1,
					},
				],
			};
			setChartData(newData); // Update the chart data
		}
	}, [expensesList, isDarkMode]); // Re-run when expensesList or theme changes

	if (expensesList.length === 0) {
		return (
			<div>
				<Loader />
			</div>
		);
	}

	return (
		<div className="w-full ">
			<div>
				<Pie data={chartData} />
			</div>
		</div>
	);
}

export default PiChart;
