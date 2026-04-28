import type { Creature, Equipment, Material, Monster, Treasure } from "../../types/hyrule/types";

export const transformCreaturesData = (creatures: Creature[]) => {
	if (!creatures) {
		return [];
	}

	//console.log(creatures);
	return creatures.map((item) => ({
		id: item.id,
		name: item.name,
		category: item.category,
		image: item.image,
		description: item.description,
		common_locations: item.common_locations || [],
		dlc: item.dlc,
		edible: item.edible,
		drops: item.drops || [],
	}));
};


export const transformEquipmentsData = (equipments: Equipment[]) =>{
    if(!equipments)
    {
        return [];
    }

    return equipments.map((item) =>({
        id: item.id,
        name: item.name,
        category: item.category,
        image: item.image,
        description: item.description,
        common_locations: item.common_locations,
        dlc: item.dlc,
        properties: item.properties,
    }));
};

export const transformMaterialsData = (materials: Material[]) =>{
    if(!materials)
    {
        return [];
    }

    return materials.map((item) =>({
        id: item.id,
        name : item.name,
        category : item.category,
        image: item.image,
        description: item.description,
        common_locations: item.common_locations,
        dlc: item.dlc,
        cooking_effect: item.cooking_effect,
        hearts_recovered : item.hearts_recovered,
    }));
};

export const transformMonstersData = (monsters: Monster[])=>
{
    if(!monsters)
    {
        return [];
    }

    return monsters.map((item) =>({
        id: item.id,
        name : item.name,
        category : item.category,
        image: item.image,
        description: item.description,
        common_locations: item.common_locations,
        dlc: item.dlc,
        drops:item.drops,
    }));
};

export const transformTreasuresData = (treasures: Treasure[])=>
{
    if(!treasures)
    {
        return [];
    }

    return treasures.map((item) =>({
        id: item.id,
        name : item.name,
        category : item.category,
        image: item.image,
        description: item.description,
        common_locations: item.common_locations,
        dlc: item.dlc,
        drops:item.drops,
    }));
};