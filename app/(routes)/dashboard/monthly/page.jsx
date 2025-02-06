'use client';
import React, { useState } from 'react';
import CashFlow from './_component/CashFlow';
import MonthlyIncome from './_component/Income';
import MonthlyExpense from './_component/Expense';
import InputDetail from './_component/InputDetail';

function Monthly() {
	const [month, setMonth] = useState('');

	return (
		<div className="mt-5 flex flex-col gap-5">
			<div className="self-end">
				<InputDetail />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
				<div>
					<CashFlow month={month} setMonth={setMonth} />
				</div>
				<div>
					<MonthlyIncome month={month} />
				</div>
				<div>
					<MonthlyExpense month={month} />
				</div>
			</div>
		</div>
	);
}

export default Monthly;
