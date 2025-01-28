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

function CreateBudget({ refreshData }) {
	const [emojiIcon, setEmojiIcon] = useState('Emoji');
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');

	const { user } = useUser();
	const onCreateBudget = async () => {
		try {
			// Debugging: Log the nested user object
			// console.log('User object:', user);
			// console.log('User email:', user?.primaryEmailAddress?.emailAddress);

			// Extract the email safely
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
				<DialogTrigger>
					<div className="bg-slate-100 p-10 rounded-md flex items-center flex-col border-dashed border-2 cursor-pointer hover:shadow-md">
						<h2 className="text-3xl">+</h2>
						<h2>Create New Budget</h2>
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
										placeholder="e.g 5000 Dkk"
										type="number"
										onChange={(e) => setAmount(e.target.value)}
									/>
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
