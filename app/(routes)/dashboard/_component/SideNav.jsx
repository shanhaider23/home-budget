'use client';

import { Fragment, useEffect, useState } from 'react';

import Link from 'next/link';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { NavItems } from '../../../config';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import TransitionLink from '@/app/_component/TransitionLink';

export default function SideNav() {
	const { isSignedIn } = useUser();
	const navItems = NavItems();
	const path = usePathname();

	const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = window.localStorage.getItem('sidebarExpanded');
			if (saved === null) {
				return true;
			}
			return JSON.parse(saved);
		}
		return true;
	});

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(
				'sidebarExpanded',
				JSON.stringify(isSidebarExpanded)
			);
		}
	}, [isSidebarExpanded, path, isSignedIn]);

	const toggleSidebar = () => {
		setIsSidebarExpanded(!isSidebarExpanded);
	};

	return (
		<div className="z-[999]">
			{isSignedIn && (
				<div className="pr-4 z-50 h-full">
					<div
						className={cn(
							isSidebarExpanded ? 'w-[255px]' : 'w-[68px]',
							'border-r transition-all duration-300 ease-in-out transform hidden sm:flex h-full border-gray-200 dark:border-gray-700 shadow-lg  bg-white dark:bg-gray-800 dark:text-white '
						)}
					>
						<aside className="flex h-full flex-col w-full break-words px-4 overflow-x-hidden columns-1">
							{/* Top */}
							<div className="mt-4 relative pb-4">
								<div className="flex flex-col space-y-1">
									{navItems.map((item, idx) => {
										if (item.position === 'top') {
											return (
												<Fragment key={idx}>
													<div className="space-y-1">
														<SideNavItem
															label={item.name}
															icon={item.icon}
															path={item.href}
															active={item.active}
															isSidebarExpanded={isSidebarExpanded}
														/>
													</div>
												</Fragment>
											);
										}
									})}
								</div>
							</div>
							{/* Bottom */}
							<div className="sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block">
								{navItems.map((item, idx) => {
									if (item.position === 'bottom') {
										return (
											<Fragment key={idx}>
												<div className="space-y-1">
													<SideNavItem
														label={item.name}
														icon={item.icon}
														path={item.href}
														active={item.active}
														isSidebarExpanded={isSidebarExpanded}
													/>
												</div>
											</Fragment>
										);
									}
								})}
							</div>
						</aside>
						<div className="mt-[calc(calc(90vh)-40px)] relative">
							<button
								type="button"
								className="absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center border border-muted-foreground/20 rounded-full bg-accent shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
								onClick={toggleSidebar}
							>
								{isSidebarExpanded ? (
									<ChevronLeft size={16} className="stroke-foreground" />
								) : (
									<ChevronRight size={16} className="stroke-foreground" />
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export const SideNavItem = ({
	label,
	icon,
	path,
	active,
	isSidebarExpanded,
}) => {
	return (
		<>
			{isSidebarExpanded ? (
				<TransitionLink href={path}>
					<h2
						className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 mb-2 transition-all dark:hover:bg-blue-600 dark:text-gray-300 dark:hover:text-white ${
							path === active &&
							'text-primary bg-blue-100 dark:bg-blue-600 dark:text-white'
						}`}
					>
						{icon}
						{label}
					</h2>
				</TransitionLink>
			) : (
				<TooltipProvider delayDuration={70}>
					<Tooltip>
						<TooltipTrigger>
							<Link href={path}>
								<h2
									className={`flex gap-2  items-center text-gray-500 font-medium p-2 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 mb-2 transition-all dark:hover:bg-blue-600 dark:text-gray-300 dark:hover:text-white ${
										path === active &&
										'text-primary bg-blue-100 dark:bg-blue-600 dark:text-white'
									}`}
								>
									{icon}
								</h2>
							</Link>
						</TooltipTrigger>
						<TooltipContent
							side="right"
							className="px-3 py-1.5 text-xs "
							sideOffset={10}
						>
							<span>{label}</span>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</>
	);
};
