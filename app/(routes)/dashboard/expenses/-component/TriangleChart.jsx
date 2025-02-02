import React, { FunctionComponent } from 'react';
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

const data = [
	{
		name: 'Jan',
		uv: 4000,
	},
	{
		name: 'Feb',
		uv: 3000,
	},
	{
		name: 'Mar',
		uv: 2000,
	},
	{
		name: 'Apr',
		uv: 2780,
	},
	{
		name: 'May',
		uv: 1890,
	},
	{
		name: 'Jun',
		uv: 2390,
	},
	{
		name: 'Jul',
		uv: 3490,
	},
	{
		name: 'Aug',
		uv: 3490,
	},
	{
		name: 'Sep',
		uv: 3490,
	},
	{
		name: 'Oct',
		uv: 3490,
	},
	{
		name: 'Nov',
		uv: 3490,
	},
	{
		name: 'Dec',
		uv: 3490,
	},
];

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

export default function TriangleChart() {
	return (
		<ResponsiveContainer width={'100%'} height={250}>
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
	);
}
