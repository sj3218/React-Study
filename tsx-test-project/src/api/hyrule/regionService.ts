import { hyruleAPI } from "../hyrule";

export const fetchAllRegions = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_REGIONS);
	return response.data;
};
