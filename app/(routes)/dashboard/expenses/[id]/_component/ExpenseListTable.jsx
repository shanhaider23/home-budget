import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

function ExpenseListTable({ expensesList, refreshData }) {
	const deleteExpense = async (expense) => {
		const confirmDelete = window.confirm(
			`Are you sure you want to delete "${expense.name}"?`
		);
		if (!confirmDelete) return;

		const results = await db
			.delete(Expenses)
			.where(eq(Expenses.id, expense.id))
			.returning();

		if (results.length > 0) {
			toast.success('Expense Deleted');
			refreshData();
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border  border-gray-200 dark:border-gray-700">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
							<th className="p-3 font-semibold min-w-[150px]">Name</th>
							<th className="p-3 font-semibold min-w-[100px]">Amount</th>
							<th className="p-3 font-semibold min-w-[100px]">Category</th>
							<th className="p-3 font-semibold min-w-[150px]">Date</th>
							<th className="p-3 font-semibold min-w-[100px] text-center">
								Action
							</th>
						</tr>
					</thead>

					{/* Table Body */}
					<tbody>
						{expensesList.length > 0 ? (
							expensesList.map((expense) => (
								<tr
									key={expense.id}
									className="border-b last:border-none hover:bg-gray-100 dark:hover:bg-gray-600 transition"
								>
									<td className="p-3 text-gray-800 dark:text-gray-200">
										{expense.name}
									</td>
									<td className="p-3 text-gray-800 dark:text-gray-200">
										{expense.amount}
									</td>
									<td className="p-3 text-gray-800 dark:text-gray-200">
										{expense.category}
									</td>
									<td className="p-3 text-gray-800 dark:text-gray-200">
										{expense.createdAt}
									</td>
									<td className="p-3 text-center">
										<button
											className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition"
											onClick={() => deleteExpense(expense)}
										>
											<Trash size={18} />
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan="4"
									className="text-center p-5 text-gray-500 dark:text-gray-400"
								>
									No expenses found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default ExpenseListTable;
