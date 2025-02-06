'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpense } from '@/redux/slices/expenseSlice';
import { Loader, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

function Income() {
	return <div>income</div>;
}

export default Income;
