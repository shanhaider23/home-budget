'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Expenses } from '@/utils/schema';
import { db } from '@/utils/dbConfig';
import { toast } from 'sonner';
import { Budgets } from '@/utils/schema';
import moment from 'moment';
import { Loader } from 'lucide-react';

function AddExpense({ budgetId, user }) {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [loadings, setLoadings] = useState(false);

	const AddExpense = async () => {
		try {
			if (!name || !amount) {
				toast.error('All fields are required, including email.');
				return;
			}
			setLoadings(true);
			const result = await db
				.insert(Expenses)
				.values({
					name: name,
					amount: amount,
					budgetId: budgetId,
					createdAt: moment().format('DD/MM/YYYY'),
				})
				.returning({ inserted: Budgets.id });

			setAmount('');
			setName('');

			if (result) {
				setLoadings(false);
				// refreshData();
				toast.success('New Expense Added');
			}
			setLoadings(false);
		} catch (error) {
			console.error('Error creating budget:', error);
			toast.error('Failed to create budget. Please try again.');
		}
	};
	return (
		<div className="p-5 border rounded-lg shadow-lg bg-white">
			<h2 className="font-bold text-lg">Add Expense</h2>
			<div>
				<div className="mt-2">
					<h2 className="text-black font-bold my-1">Expense Name</h2>
					<Input
						placeholder="e.g home decor"
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
				</div>
				<div className="mt-2">
					<h2 className="text-black font-bold my-1">Expense Amount</h2>
					<Input
						placeholder="e.g 5000 Dkk"
						type="number"
						onChange={(e) => setAmount(e.target.value)}
						value={amount}
					/>
				</div>
				<Button
					disabled={!(name && amount)}
					className="mt-5 w-full"
					onClick={AddExpense}
				>
					{loadings ? <Loader className="animate-spin" /> : 'Add New Expense'}
				</Button>
			</div>
		</div>
	);
}

export default AddExpense;
