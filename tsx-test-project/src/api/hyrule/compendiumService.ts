import { transformCreaturesData, transformEquipmentsData, transformMaterialsData, transformMonstersData, transformTreasuresData } from "../../utils/hyrule/HyruleTransform";
import { hyruleAPI } from "../hyrule";

export const fetchAllCompendium = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_ALL_DATA);
	return response.data.data;
};

export const fetchCompendiumCreatures = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_CREATURES);
	const data = transformCreaturesData(response.data.data);
	sessionStorage.setItem("creaturesData", JSON.stringify(response.data.data));
	return data;
};

export const fetchCompendiumEquipment = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_EQUIPMENT);
	const data = transformEquipmentsData(response.data.data);
	sessionStorage.setItem("equipmentsData", JSON.stringify(response.data.data));
	return data;
};

export const fetchCompendiumMaterials = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_MATERIALS);
	const data = transformMaterialsData(response.data.data);
	sessionStorage.setItem("materialsData", JSON.stringify(response.data.data));
	return data;
};

export const fetchCompendiumMonsters = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_MONSTERS);
	const data = transformMonstersData(response.data.data);
	sessionStorage.setItem("monstersData", JSON.stringify(response.data.data));
	return data;
};

export const fetchCompendiumTreasure = async () => {
	const response = await hyruleAPI.get(import.meta.env.VITE_REACT_APP_HYRULE_COMPENDIUM_TREASURE);
	const data = transformTreasuresData(response.data.data);
	sessionStorage.setItem("treasuresData", JSON.stringify(response.data.data));
	return data;
};
