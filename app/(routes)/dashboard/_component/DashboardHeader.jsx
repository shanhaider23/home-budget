import DarkModeToggle from '@/app/_component/DarkModeToggle';
import { Input } from '@/components/ui/input';
import { UserButton } from '@clerk/nextjs';
import React from 'react';
import { useUser } from '@clerk/nextjs';

function DashboardHeader() {
	const { user } = useUser();
	return (
		<div className="p-5 shadow-lg box flex justify-between items-center gap-5 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
			<div>
				<h2 className="font-bold text-xl ">Hi, {user?.firstName} ✌️</h2>
				<p className="text-gray-500 -mb-5 mt-3 text-sm">
					What's happening with your money?
				</p>
			</div>
			<div className="flex items-center justify-center gap-5">
				<div>
					<Input className="w-[250px] p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>

				<div className=" flex justify-center items-center">
					<DarkModeToggle />
				</div>
			</div>
		</div>
	);
}

export default DashboardHeader;
