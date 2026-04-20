import {client} from "./client"

export const fetchAllTodos = async () => {
    const response = await client.get("/todos");
    return response.data;
};