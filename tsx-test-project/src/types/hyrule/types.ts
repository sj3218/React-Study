export interface BaseItem {
	id: number;
	name: string;
	category: string;
	image: string;
	description: string;
	common_locations: string[];
	dlc: boolean;
}

export interface Creature extends BaseItem {
	edible: boolean;
	drops: string[];
}

export interface Equipment extends BaseItem {
	properties: {
		attack: number;
		defense: number;
	};
}

export interface Material extends BaseItem {
	cooking_effect: string;
	hearts_recovered: number;
}

export interface Monster extends BaseItem {
	drops: string[];
}

export interface Treasure extends BaseItem {
	drops: string[];
}
