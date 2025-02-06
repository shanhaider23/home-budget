'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addMonthly } from '@/redux/slices/monthlySlice';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

function InputDetail() {
	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState('');
	const [type, setType] = useState('');

	const dispatch = useDispatch();

	const handleInputDetail = async () => {
		if (!amount || !category) {
			toast.error('All fields are required.');
			return;
		}

		setLoading(true);

		dispatch(addMonthly({ date, type, category, amount }));
		// await refreshData(); // Fetch updated data
		setType('');
		setCategory('');
		setAmount('');
		setCategory('');
		setLoading(false);
	};

	return (
		<div className="p-5 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
			<h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
				Add Income or Expense
			</h2>
			<div>
				<div className="mt-2">
					<h2 className="text-black font-bold my-1 dark:text-gray-300">Date</h2>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={'outline'}
								className={cn(
									'w-[240px] justify-start text-left font-normal dark:bg-gray-700 dark:text-gray-200',
									!date && 'text-muted-foreground'
								)}
							>
								<CalendarIcon />
								{date ? format(date, 'PPP') : <span>Pick a date</span>}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={date}
								onSelect={setDate}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className="mt-2">
					<Label className="text-md text-black font-bold my-1 dark:text-gray-300">
						From
					</Label>
					<Select value={type} onValueChange={setType}>
						<SelectTrigger className=" dark:bg-gray-700 dark:text-gray-200">
							<SelectValue placeholder="Select a type" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="income">Income</SelectItem>
								<SelectItem value="expense">Expense</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="mt-2">
					<Label className="text-md text-black font-bold my-1 dark:text-gray-300">
						Category
					</Label>
					<Input
						placeholder="Grocery"
						onChange={(e) => setCategory(e.target.value)}
						value={category}
						className="dark:bg-gray-700 dark:text-gray-200"
					/>
				</div>

				<div className="mt-2">
					<Label className="text-md text-black font-bold my-1 dark:text-gray-300">
						Amount
					</Label>
					<Input
						placeholder="e.g 5000"
						type="number"
						onChange={(e) => setAmount(e.target.value)}
						value={amount}
						className="dark:bg-gray-700 dark:text-gray-200"
					/>
				</div>

				<Button
					disabled={!(amount && category)}
					className="mt-5 w-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
					onClick={handleInputDetail}
				>
					{loading ? <Loader className="animate-spin" /> : 'Add New Expense'}
				</Button>
			</div>
		</div>
	);
}

export default InputDetail;
