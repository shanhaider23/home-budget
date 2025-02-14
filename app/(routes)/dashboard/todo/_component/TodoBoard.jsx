'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask } from '@/redux/slices/todoSlice';
import Column from './Column';
import AddTodo from './AddTodo';
import { useUser } from '@clerk/nextjs';

const COLUMNS = [
	{ id: 'todo', title: 'To Do' },
	{ id: 'inprogress', title: 'In Progress' },
	{ id: 'done', title: 'Done' },
];

export default function TodoBoard() {
	const dispatch = useDispatch();
	const { user } = useUser();
	const [refreshKey, setRefreshKey] = useState(0);
	const { list: tasks, loading, error } = useSelector((state) => state.tasks);

	useEffect(() => {
		if (user?.primaryEmailAddress?.emailAddress) {
			dispatch(fetchTasks(user.primaryEmailAddress.emailAddress));
		}
	}, [dispatch, user]);
	const refreshData = () => {
		dispatch(fetchTasks());
		setRefreshKey((prevKey) => prevKey + 1);
	};
	function handleDragEnd(event) {
		const { active, over } = event;
		if (!over) return;

		const taskId = active.id;
		const newStatus = over.id;

		dispatch(updateTask({ id: taskId, status: newStatus }));
	}

	return (
		<div className="w-full pl-5 pr-5">
			<div className="w-full flex justify-end items-center pb-5">
				<div>
					<AddTodo refreshData={refreshData} />
				</div>
			</div>

			<div>
				<DndContext
					key={refreshKey}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<div className="flex gap-2 flex-wrap justify-between items-start">
						{COLUMNS.map((column) => (
							<Column
								key={column.id}
								column={column}
								refreshData={refreshData}
								tasks={tasks.filter((task) => task.status === column.id)}
							/>
						))}
					</div>
				</DndContext>
			</div>
		</div>
	);
}
