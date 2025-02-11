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
import { predefinedCategories } from '@/lib/categories';
import { Calendar } from '@/components/ui/calendar';
import DatePicker from 'react-datepicker';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from '@/components/ui/command';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@clerk/nextjs';

function InputDetail() {
	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState('');
	const [type, setType] = useState('');

	const dispatch = useDispatch();
	const { user } = useUser();
	const handleInputDetail = async () => {
		const email = user?.primaryEmailAddress?.emailAddress;
		if (!amount || !category) {
			toast.error('All fields are required.');
			return;
		}

		setLoading(true);

		dispatch(addMonthly({ date, type, category, amount, email }));
		// await refreshData(); // Fetch updated data
		setType('');
		setCategory('');
		setAmount('');
		setCategory('');
		setLoading(false);
	};

	return (
		<div>
			<Dialog className="p-5 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 z-auto ">
				<DialogTrigger asChild>
					<div className=" cursor-pointer w-full ">
						<Button className="bg-blue-800  text-gray-100 dark:text-gray-200  dark:hover:text-gray-800 w-full">
							Add Income or Expense
						</Button>
					</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="font-bold text-lg text-gray-800 dark:text-gray-200">
							Add Income or Expense
						</DialogTitle>
						<DialogDescription>
							<div>
								<div className="mt-2">
									<div className="flex flex-col gap-2 items-start justify-start">
										<h2 className="text-black font-bold my-1 dark:text-gray-300">
											Date
										</h2>
										<p className="flex justify-start gap-2 items-center">
											<CalendarIcon />
											{date ? format(date, 'PPP') : <span>Pick a date</span>}
										</p>
									</div>
									<Calendar
										mode="single"
										selected={date}
										onSelect={setDate}
										initialFocus
										className="ml-2"
									/>
								</div>
								<div className="mt-2">
									<Label className="text-md text-black font-bold my-1 dark:text-gray-300 ">
										Type
									</Label>

									<RadioGroup
										value={type}
										onValueChange={setType}
										className="mt-2"
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="income" id="income" />
											<Label htmlFor="income">Income</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="expense" id="expense" />
											<Label htmlFor="expense">Expense</Label>
										</div>
									</RadioGroup>
								</div>
								<div className="mt-2">
									<Label className="text-md text-black font-bold my-1 dark:text-gray-300">
										Category
									</Label>
									<Command className="rounded-lg border shadow-md md:min-w-[400px] h-[150px] overflow-y-hidden mt-1">
										<CommandInput placeholder="Type a command or search..." />
										<CommandList>
											<CommandEmpty>No results found.</CommandEmpty>
											<CommandGroup
												heading="Suggestions"
												className=" overflow-y-auto"
											>
												{predefinedCategories.map((item) => (
													<CommandItem
														key={item}
														onSelect={() => setCategory(item)}
													>
														{item}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
									<Input
										placeholder="Type Category"
										onChange={(e) => setCategory(e.target.value)}
										value={category}
										className="dark:bg-gray-700 dark:text-gray-200 mt-4"
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
							</div>
						</DialogDescription>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<Button
									disabled={!(amount && category)}
									className="mt-5 w-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
									onClick={handleInputDetail}
								>
									{loading ? (
										<Loader className="animate-spin" />
									) : (
										'Add New Income or Expense'
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

export default InputDetail;
