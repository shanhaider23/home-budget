import React from 'react';
import InputDetail from './_component/InputDetail';
import CashFlow from './_component/CashFlow';
import MonthlyIncome from './_component/Income';
import MonthlyExpense from './_component/Expense';

function Monthly() {
	return (
		<div className="flex justify-center gap-10 items-center mt-5">
			<div>
				<CashFlow />
				<InputDetail />
			</div>
			<div>
				<MonthlyIncome />
			</div>
			<div>
				<MonthlyExpense />
			</div>
		</div>
	);
}

export default Monthly;
