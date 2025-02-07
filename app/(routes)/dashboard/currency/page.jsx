'use client';
import React from 'react';
import CurrencyConverter from './_component/CurrencyConverter';

function Currency() {
	return (
		<div className="mt-5">
			<div>
				<h1 className="text-3xl mb-5 font-bold ">Currency</h1>
			</div>
			<div>
				<CurrencyConverter />
			</div>
		</div>
	);
}

export default Currency;
