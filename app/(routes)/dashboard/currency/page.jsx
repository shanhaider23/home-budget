'use client';
import React from 'react';
import CurrencyConverter from './_component/CurrencyConverter';
import { LineCharts } from './_component/LineChart';

function Currency() {
	return (
		<div>
			<div>
				<CurrencyConverter />
			</div>
			<div>
				<LineCharts />
			</div>
		</div>
	);
}

export default Currency;
