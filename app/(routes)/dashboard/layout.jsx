'use client';
import React, { useEffect } from 'react';
import SideNav from './_component/SideNav';
import DashboardHeader from './_component/DashboardHeader';
import { useUser } from '@clerk/nextjs';
import { Budgets } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/dbConfig';
import { useRouter } from 'next/navigation';

function DashboardLayout({ children }) {
	const { user } = useUser();
	const router = useRouter();
	useEffect(() => {
		checkUserBudgets();
	}, [user]);
	const checkUserBudgets = async () => {
		const result = await db
			.select()
			.from(Budgets)
			.where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));
	};
	return (
		<div>
			<div className="fixed md:w-64 hidden md:block ">
				<SideNav />
			</div>
			<div className="md:ml-64">
				{' '}
				<DashboardHeader />
				{children}
			</div>{' '}
		</div>
	);
}

export default DashboardLayout;
