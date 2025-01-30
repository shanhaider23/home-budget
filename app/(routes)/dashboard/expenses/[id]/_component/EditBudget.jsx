'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PenBox } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
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
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';

function EditBudget({ budgetInfo, refreshData }) {
	const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
	const [name, setName] = useState(budgetInfo?.name);
	const [amount, setAmount] = useState(budgetInfo?.amount);

	const { user } = useUser();

	// useEffect(() => {
	//     if(budgetInfo){
	//         setEmojiIcon(budgetInfo.icon)
	//         setAmount(budgetInfo.amount)
	//         setName(budgetInfo.name)
	//     }
	// })
	const onEditBudget = async () => {
		const result = await db
			.update(Budgets)
			.set({
				name: name,
				amount: amount,
				icon: emojiIcon,
			})
			.where(eq(Budgets.id, budgetInfo.id))
			.returning();
		if (result) {
			refreshData();
			toast.success('Budget Updated');
		}
	};
	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<Button className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700">
						<PenBox /> Edit
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-gray-800 dark:text-gray-200">
							Update Budget
						</DialogTitle>
						<DialogDescription>
							<div className="mt-5">
								<Button
									variant="outline"
									onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
									size="lg"
									className="dark:text-gray-200 dark:border-gray-700 dark:bg-gray-700"
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
										defaultValue={budgetInfo?.name}
										className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
										defaultValue={budgetInfo?.amount}
										className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
									/>
								</div>
							</div>
						</DialogDescription>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<Button
									disabled={!(name && amount)}
									className="mt-5 w-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
									onClick={onEditBudget}
								>
									Update Budget
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default EditBudget;
