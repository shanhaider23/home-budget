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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

function CreateBudget({ refreshData }) {
	const [emojiIcon, setEmojiIcon] = useState('Emoji');
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [currency, setCurrency] = useState('');

	const { user } = useUser();
	const onCreateBudget = async () => {
		try {
			const email = user?.primaryEmailAddress?.emailAddress;

			if (!name || !amount || !email) {
				toast.error('All fields are required, including email.');
				return;
			}

			// Insert into the database
			const result = await db
				.insert(Budgets)
				.values({
					name: name,
					amount: amount,
					currency: currency,
					createdBy: email,
					icon: emojiIcon,
				})
				.returning({ inserted: Budgets.id });

			if (result) {
				refreshData();
				toast.success('New Budget Created');
			}
		} catch (error) {
			console.error('Error creating budget:', error);
			toast.error('Failed to create budget. Please try again.');
		}
	};

	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<div className=" cursor-pointer ">
						<Button className="bg-blue-800">Create New Budget</Button>
					</div>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Budget</DialogTitle>
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
									<h2 className="text-black font-bold my-1">Budget Name</h2>
									<Input
										placeholder="e.g home decor"
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="mt-2">
									<h2 className="text-black font-bold my-1">Budget Amount</h2>
									<Input
										placeholder="e.g 5000"
										type="number"
										onChange={(e) => setAmount(e.target.value)}
									/>
								</div>
								<div className="mt-2">
									<select
										value={currency}
										onChange={(e) => setCurrency(e.target.value)}
										className="w-full p-2 border rounded-md"
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
