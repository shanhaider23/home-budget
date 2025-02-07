import DarkModeToggle from '@/app/_component/DarkModeToggle';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { NavItems } from '../../../config';

function DashboardHeader() {
	const { user } = useUser();
	const navItems = NavItems();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	return (
		<div className="p-4 shadow-lg flex justify-between items-center gap-5 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative">
			<div className="flex items-center gap-3">
				<button
					className="sm:hidden bg-gray-800 text-white p-2 rounded-md"
					onClick={toggleMobileMenu}
				>
					{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>

				<div className="hidden sm:flex items-center -mb-5 -mt-5  ">
					<Link href={'/dashboard'}>
						<Image src={'/logo.png'} alt="Logo" width={120} height={100} />
					</Link>
				</div>
			</div>

			{/* === CENTER: Search Bar (Hidden on Mobile) === */}
			<div className="hidden sm:block">
				<Input
					placeholder="Search budget"
					className="w-[250px] p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* === RIGHT SIDE: User & Dark Mode Toggle === */}
			<div className="flex items-center gap-4">
				<UserButton />
				<p> {user?.fullName}</p>
				<DarkModeToggle />
			</div>

			{/* === MOBILE MENU (Dropdown) === */}
			{isMobileMenuOpen && (
				<div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md sm:hidden z-50">
					<div className="flex justify-start items-center gap-3 pl-5 pt-5  ">
						<Image src={'/logo.png'} alt="Logo" width={120} height={100} />
					</div>
					<ul className="flex flex-col p-4 space-y-2">
						{navItems.map((item, idx) => (
							<li key={idx}>
								<Link
									href={item.href}
									className=" p-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex justify-start items-center gap-3"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{item.icon}
									{item.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default DashboardHeader;
