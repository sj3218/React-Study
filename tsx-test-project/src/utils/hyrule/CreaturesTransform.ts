export const transformCreaturesData = (creatures: any[]) => {
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
