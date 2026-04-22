export interface BaseItem {
	id: number;
	name: string;
	category: string;
	image: string;
	description: string;
	common_locations: string[];
	dlc: boolean;
}

export interface Creatures extends BaseItem {
	edible: boolean;
	drops: string[];
}

export interface EQUIPMENT extends BaseItem {
	properties: {
		attack: number;
		defense: number;
	};
}

export interface MATERIAL extends BaseItem {
	cooking_effect: string;
	hearts_recovered: number;
}

export interface MONSTER extends BaseItem {
	drops: string[];
}

export interface TREASURE extends BaseItem {
	drops: string[];
}
