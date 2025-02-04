import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Loader } from 'lucide-react';
import moment from 'moment';
import {
	BarChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
} from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const colors = scaleOrdinal(schemeCategory10).range();
const getPath = (x, y, width, height) => {
	return `M${x},${y + height} 
            C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} 
            ${x + width / 2}, ${y} 
            C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${
		y + height
	} 
            ${x + width}, ${y + height} Z`;
};

const TriangleBar = (props) => {
	const { fill, x, y, width, height } = props;
	return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

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
	const [data, setData] = useState([]);

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

			const groupedData = expensesList.reduce((acc, expense) => {
				const month = moment(expense.createdAt, 'DD/MM/YYYY').format('MMM'); // Get the month abbreviation
				if (!acc[month]) {
					acc[month] = 0;
				}
				acc[month] += Number(expense.amount); // Sum the amounts for each month
				return acc;
			}, {});

			// Convert grouped data into the format needed for the chart
			const transformedData = Object.keys(groupedData).map((month) => ({
				name: month,
				uv: groupedData[month],
			}));
			console.log(transformedData, 'Grouped Data'); // Log the grouped data
			setData(transformedData);
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
			<div className="grid grid-cols-1 ">
				<div>
					<Pie data={chartData} />
				</div>
				<div>
					<ResponsiveContainer width={'100%'}>
						<BarChart
							width={700}
							height={400}
							data={data}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Bar
								dataKey="uv"
								fill="#8884d8"
								shape={<TriangleBar />}
								label={{ position: 'top' }}
							>
								{data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={colors[index % 20]} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

export default PiChart;
