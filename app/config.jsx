import { usePathname } from 'next/navigation';

import {
	Settings,
	Currency,
	LayoutGrid,
	PiggyBank,
	ReceiptText,
} from 'lucide-react';

export const NavItems = () => {
	const pathname = usePathname();

	function isNavItemActive(pathname) {
		return pathname;
	}

	return [
		{
			id: 1,
			name: 'Dashboard',
			href: '/dashboard',
			icon: <LayoutGrid size={20} />,
			active: isNavItemActive(pathname, '/dashboard'),
			position: 'top',
		},
		{
			id: 2,
			name: 'Budgets',
			href: '/dashboard/budgets',
			icon: <PiggyBank size={20} />,
			active: isNavItemActive(pathname, '/dashboard/budgets'),
			position: 'top',
		},
		{
			id: 3,
			name: 'Expenses',
			href: '/dashboard/expenses',
			icon: <ReceiptText size={20} />,
			active: isNavItemActive(pathname, '/dashboard/expenses'),
			position: 'top',
		},
		{
			id: 4,
			name: 'Currency Converter',
			href: '/dashboard/currency',
			icon: <Currency size={20} />,
			active: isNavItemActive(pathname, '/dashboard/currency'),
			position: 'top',
		},
		{
			name: 'Settings',
			href: '/settings',
			icon: <Settings size={20} />,
			active: isNavItemActive(pathname, '/settings'),
			position: 'bottom',
		},
	];
};
