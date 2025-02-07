import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function Column({ column, tasks }) {
	const { setNodeRef } = useDroppable({ id: column.id });

	return (
		<div className="flex w-80 min-h-80  flex-col shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-4">
			<h1 className="mb-4 font-bold text-xl text-center">{column.title}</h1>
			<div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}
