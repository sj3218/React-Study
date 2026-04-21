import { number } from "motion";
import { object } from "motion/react-client";

// src/utils/dataTransform.ts
export const transformTodoStats = (todos: any[]) => {
	return todos.reduce((acc, cur) => {
		const { userId, completed } = cur;
		if (!acc[userId]) {
			acc[userId] = { done: 0, undone: 0 };
		}
		completed ? acc[userId].done++ : acc[userId].undone++;
		return acc;
	}, {});
};

export const transformTodoStatsFromTo = (todos: any[], begin: number, end: number) => {
	const result = { done: 0, undone: 0 };

	for (let i = begin; i <= end; ++i) {
		result.done += todos[i].done;
		result.undone += todos[i].undone;
	}

	return result;
};

export const transformTodoStatsForCSV = (todos: any[]) => {
	return Object.keys(todos).map((id) => ({
		userId: id,
		done: todos[Number(id)].done,
		undone: todos[Number(id)].undone,
	}));
};
