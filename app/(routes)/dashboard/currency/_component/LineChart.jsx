'use client';
import React from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

const data = [
	{
		name: '2020',
		PKR: 4000,
		USD: 2400,
		EUR: 2400,
		GBP: 1500,
		INR: 1000,
	},
	{
		name: '2021',
		PKR: 4000,
		USD: 2400,
		EUR: 2400,
		GBP: 1500,
		INR: 1000,
	},
	{
		name: '2022',
		PKR: 4000,
		USD: 2400,
		EUR: 2400,
		GBP: 1500,
		INR: 1000,
	},
	{
		name: '2023',
		PKR: 4000,
		USD: 2400,
		EUR: 2400,
		GBP: 1500,
		INR: 1000,
	},
	{
		name: '2025',
		PKR: 4000,
		USD: 2400,
		EUR: 2400,
		GBP: 1500,
		INR: 1000,
	},
];

export function LineCharts() {
	return (
		<div>
			<h2>History</h2>
			<ResponsiveContainer width="100%" height={400}>
				<LineChart
					width={500}
					height={300}
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="PKR"
						stroke="#8884d8"
						activeDot={{ r: 8 }}
					/>
					<Line type="monotone" dataKey="EUR" stroke="#82ca9d" />
					<Line type="monotone" dataKey="amt" stroke="#1f5132" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
