'use client';
import React, { useState } from 'react';
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
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { createBudget } from '@/redux/slices/budgetSlice';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

function CreateBudget({ refreshData }) {
	const dispatch = useDispatch();
	const [emojiIcon, setEmojiIcon] = useState('Emoji');
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [currency, setCurrency] = useState('DKK');

	const { user } = useUser();
	const onCreateBudget = async () => {
		const email = user?.primaryEmailAddress?.emailAddress;

		if (!name || !amount || !currency || !email) {
			toast.error('All fields are required, including email.');
			return;
		}

		dispatch(createBudget({ name, amount, currency, email, emojiIcon }));
		setName('');
		setAmount('');
		setCurrency('');
	};

	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<div className=" cursor-pointer ">
						<Button className="bg-blue-800  text-gray-100 dark:text-gray-200  dark:hover:text-gray-800">
							Create New Budget
						</Button>
					</div>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="font-bold text-lg text-gray-800 dark:text-gray-200">
							Create New Budget
						</DialogTitle>
						<DialogDescription>
							<div className="mt-5">
								<Button
									variant="outline"
									onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
									size="lg"
								>
									{emojiIcon}
								</Button>
								<div className="absolute z-20">
									<EmojiPicker
										open={openEmojiPicker}
										onEmojiClick={(e) => {
											setEmojiIcon(e.emoji);
											setOpenEmojiPicker(false);
										}}
									/>
								</div>
								<div className="mt-2">
									<h2 className="text-black font-bold my-1 dark:text-gray-300">
										Budget Name
									</h2>
									<Input
										placeholder="e.g home decor"
										onChange={(e) => setName(e.target.value)}
										className="dark:bg-gray-700 dark:text-gray-200"
									/>
								</div>
								<div className="mt-2">
									<h2 className="text-black font-bold my-1 dark:text-gray-300">
										Budget Amount
									</h2>
									<Input
										placeholder="e.g 5000 Dkk"
										type="number"
										onChange={(e) => setAmount(e.target.value)}
										className="dark:bg-gray-700 dark:text-gray-200"
									/>
								</div>
								<div className="mt-5">
									<select
										value={currency}
										onChange={(e) => setCurrency(e.target.value)}
										className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
									>
										<option value="kr">🇩🇰 Danish Krone (kr)</option>
										<option value="₨">🇵🇰 Pakistani Rupee (₨)</option>
										<option value="$">🇺🇸 US Dollar ($)</option>
										<option value="€">🇪🇺 Euro (€)</option>
										<option value="£">🇬🇧 British Pound (£)</option>
										<option value="₹">🇮🇳 Indian Rupee (₹)</option>
									</select>
								</div>
							</div>
						</DialogDescription>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<Button
									disabled={!(name && amount)}
									className="mt-5 w-full"
									onClick={onCreateBudget}
								>
									Create Budget
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default CreateBudget;
