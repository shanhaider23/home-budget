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
					<Button>
						{' '}
						<PenBox /> Edit
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Budget</DialogTitle>
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
										defaultValue={budgetInfo?.name}
									/>
								</div>
								<div className="mt-2">
									<h2 className="text-black font-bold my-1">Budget Amount</h2>
									<Input
										placeholder="e.g 5000 Dkk"
										type="number"
										onChange={(e) => setAmount(e.target.value)}
										defaultValue={budgetInfo?.amount}
									/>
								</div>
							</div>
						</DialogDescription>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<Button
									disabled={!(name && amount)}
									className="mt-5 w-full"
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
