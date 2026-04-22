import axios from "axios";

export const hyruleAPI = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_URL,
	headers: {
		"Content-Type": "application/json",
	},
});
