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