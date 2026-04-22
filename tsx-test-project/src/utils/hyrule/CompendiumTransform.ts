export const transformCompendiumTransform = (items: any[]) => {
	if (!items) {
		return [];
	}

	return items.map((item) => ({
		id: item.id,
		name: item.name,
		category: item.category,
		image: item.image,
		description: item.description,
		common_location: item.common_location || [],
		dlc: item.dlc,
		edible: item.edible || false,
		drops: item.drops || [],
		properties: item.properties || { attack: 0, defense: 0 },
		cooking_effect: item.cooking_effect || "",
		hearts_recovered: item.hearts_recovered || 0,
	}));
};
