import { hyruleAPI } from "../hyrule";

export const fetchAllCompendium = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_ALL_DATA);
	return response.data.data;
};

export const fetchCompendiumCreatures = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_CREATURES);
	return response.data.data;
};

export const fetchCompendiumEquipment = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_EQUIPMENT);
	return response.data.data;
};

export const fetchCompendiumMaterials = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_MATERIALS);
	return response.data.data;
};

export const fetchCompendiumMonsters = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_MONSTERS);
	return response.data.data;
};

export const fetchCompendiumTreasure = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_TREASURE);
	return response.data.data;
};
