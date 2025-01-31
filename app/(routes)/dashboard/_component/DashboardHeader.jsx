import DarkModeToggle from '@/app/_component/DarkModeToggle';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react';
import { UserButton, useUser } from '@clerk/nextjs';

function DashboardHeader() {
	const { user } = useUser();
	return (
		<div className="p-4 shadow-lg box flex justify-between items-center gap-5  border border-gray-200 dark:border-gray-700 transition-all duration-300">
			<div className=" flex items-center justify-start gap-2">
				<Image src={'/logo.svg'} alt="Logo" width={40} height={40} />
				<h2 className="text-2xl text-red-800 dark:text-red-500 font-bold">
					SpendWise
				</h2>
			</div>
			<div className="flex items-center justify-center gap-5">
				<div>
					<Input
						placeholder="Search budget"
						className="w-[250px] p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className=" flex justify-center items-center  gap-4">
					<UserButton />
					<DarkModeToggle />
				</div>
			</div>
		</div>
	);
}

export default DashboardHeader;
