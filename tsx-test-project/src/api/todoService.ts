import { client } from "./client";

export const fetchAllTodos = async () => {
	const response = await client.get("/todos");
	return response.data;
};

export const fetchPosts = async () => {
	const response = await client.get("/posts");
	return response.data;
};
