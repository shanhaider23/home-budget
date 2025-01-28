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
		<div className="h-screen p-5 border shadow-sm">
			<Image src={'/logo.svg'} alt="Logo" width={100} height={100} />
			<div className="mt-5">
				{menuList.map((menu, i) => (
					<Link href={menu.path} key={menu.id}>
						<h2
							className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 mb-2 ${
								path == menu.path && 'text-primary bg-blue-100'
							}`}
						>
							<menu.icon />
							{menu.name}
						</h2>
					</Link>
				))}
			</div>
			<div className="fixed bottom-10 p-5 flex gap-2 items-center">
				<UserButton /> Profile
			</div>
		</div>
	);
}

export default SideNav;
