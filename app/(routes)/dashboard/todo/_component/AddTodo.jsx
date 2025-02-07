'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addTasks } from '@/redux/slices/todoSlice';
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
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

function AddTodo({ refreshData }) {
	const [date, setDate] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState('');

	const dispatch = useDispatch();

	const handleAddTodo = async () => {
		if (!date || !title) {
			toast.error('All fields are required.');
			return;
		}

		setLoading(true);

		dispatch(addTasks({ date, title, status, description }));
		await refreshData();
		setDate('');
		setTitle('');
		setStatus('');
		setDescription('');
		setLoading(false);
	};

	return (
		<div>
			<Dialog className="p-5 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
				<DialogTrigger asChild>
					<div className=" cursor-pointer w-full ">
						<Button className="bg-blue-800  text-gray-100 dark:text-gray-200  dark:hover:text-gray-800 w-full">
							Add Reminder
						</Button>
					</div>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="font-bold text-lg text-gray-800 dark:text-gray-200">
							Add Reminder
						</DialogTitle>
						<DialogDescription>
							<div>
								<div className="mt-2">
									<h2 className="text-black font-bold my-1 dark:text-gray-300">
										Due Date
									</h2>
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
										Status
									</Label>
									<Select value={status} onValueChange={setStatus}>
										<SelectTrigger className=" dark:bg-gray-700 dark:text-gray-200">
											<SelectValue placeholder="Select a status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="todo">Todo</SelectItem>
												<SelectItem value="inprogress">InProgress</SelectItem>
												<SelectItem value="done">Done</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="mt-2">
									<Label className="text-md text-black font-bold my-1 dark:text-gray-300">
										Title
									</Label>
									<Input
										placeholder="Pay Electricity Bill"
										onChange={(e) => setTitle(e.target.value)}
										value={title}
										className="dark:bg-gray-700 dark:text-gray-200"
									/>
								</div>
								<div className="mt-2">
									<Label className="text-md text-black font-bold my-1 dark:text-gray-300">
										Description
									</Label>
									<Input
										placeholder="Pay Electricity Bill"
										onChange={(e) => setDescription(e.target.value)}
										value={description}
										className="dark:bg-gray-700 dark:text-gray-200"
									/>
								</div>
							</div>
						</DialogDescription>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<Button
									disabled={!(title && status)}
									className="mt-5 w-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
									onClick={handleAddTodo}
								>
									{loading ? (
										<Loader className="animate-spin" />
									) : (
										'Add New Reminder'
									)}
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddTodo;
