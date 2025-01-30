'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { LayoutGrid, PiggyBank, ReceiptText } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function SideNav() {
	const menuList = [
		{
			id: 1,
			name: 'Dashboard',
			icon: LayoutGrid,
			path: '/dashboard',
		},
		{
			id: 2,
			name: 'Budgets',
			icon: PiggyBank,
			path: '/dashboard/budgets',
		},
		{
			id: 3,
			name: 'Expenses',
			icon: ReceiptText,
			path: '/dashboard/expenses',
		},
	];
	const path = usePathname();

	useEffect(() => {}, [path]);
	return (
		<div className="h-screen p-5 border  border-gray-200 dark:border-gray-700 shadow-sm flex flex-col bg-white dark:bg-gray-800 dark:text-white">
			<div className="mb-6 flex items-center justify-start gap-5">
				<Image src={'/logo.svg'} alt="Logo" width={40} height={40} />
				<h2 className="text-3xl text-red-800 dark:text-red-500 font-bold">
					SpendWise
				</h2>
			</div>

			<div className="mt-5 flex-1">
				{menuList.map((menu) => (
					<Link href={menu.path} key={menu.id}>
						<h2
							className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 mb-2 transition-all dark:hover:bg-blue-600 dark:text-gray-300 dark:hover:text-white ${
								path === menu.path &&
								'text-primary bg-blue-100 dark:bg-blue-600 dark:text-white'
							}`}
						>
							<menu.icon size={20} />
							{menu.name}
						</h2>
					</Link>
				))}
			</div>
		</div>
	);
}

export default SideNav;
