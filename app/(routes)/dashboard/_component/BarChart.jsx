import React from 'react';
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

function BarChartDashboard({ budgetList }) {
	return (
		<div className="border rounded-lg shadow-lg bg-white hover:shadow-xl p-5">
			<h2 className="font-bold text-lg"> Activity</h2>
			<ResponsiveContainer width={'80%'} height={250}>
				<BarChart
					data={budgetList}
					margin={{
						top: 5,
						right: 5,
						left: 5,
						bottom: 5,
					}}
				>
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="totalSpend" stackId="a" fill="#8884d8" />
					<Bar dataKey="amount" stackId="a" fill="#82ca9d" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

export default BarChartDashboard;
