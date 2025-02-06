'use client';
import React, { useState } from 'react';
import CashFlow from './_component/CashFlow';
import MonthlyIncome from './_component/Income';
import MonthlyExpense from './_component/Expense';
import InputDetail from './_component/InputDetail';

function Monthly() {
	const [month, setMonth] = useState('');
	const [year, setYear] = useState('');

	return (
		<div className="mt-5">
			<div className="flex justify-center items-start gap-5 flex-wrap sm:flex-nowrap">
				{/* Left Panel */}
				<div className="w-full sm:w-[300px] self-start">
					<CashFlow
						month={month}
						setMonth={setMonth}
						year={year}
						setYear={setYear}
					/>
				</div>

				{/* Right Panel */}
				<div className="flex-grow w-full sm:w-auto pr-5">
					<div className="flex flex-col gap-3">
						<div className="w-full">
							<InputDetail />
						</div>
						<div className="flex gap-5 items-center justify-center  flex-wrap sm:flex-nowrap">
							<MonthlyIncome month={month} year={year} />
							<MonthlyExpense month={month} year={year} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Monthly;
