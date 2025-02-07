import React from 'react';
import TodoBoard from './_component/TodoBoard';

function Todo() {
	return (
		<div className="mt-5 flex flex-col justify-center items-center">
			<div>
				<TodoBoard />{' '}
			</div>
		</div>
	);
}

export default Todo;
