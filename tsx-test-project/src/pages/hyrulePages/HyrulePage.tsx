import { useEffect, useState, type ChangeEvent } from "react";
import { type BaseItem } from "../../types/hyrule/types";
import { fetchAllCompendium } from "../../api/hyrule/CompendiumService";
import { transformCompendiumTransform } from "../../utils/hyrule/CompendiumTransform";
import { v4 as uuidv4 } from "uuid";
import { Select } from "../../components/common/test/Select";

const options = [
	{ id: uuidv4(), category: "Total" },
	{ id: uuidv4(), category: "Creatures" },
	{ id: uuidv4(), category: "Equipment" },
	{ id: uuidv4(), category: "Materials" },
	{ id: uuidv4(), category: "Monsters" },
	{ id: uuidv4(), category: "Treasure" },
];

export const HyrulePage = () => {
	const [allData, setAllData] = useState<any[]>([]);
	const [filteredData, setFilteredData] = useState<any[]>([]);
	const [currentCategory, setCurrentCategory] = useState(0);

	const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setCurrentCategory(Number(e.target.value));
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await fetchAllCompendium();
				const transformed = transformCompendiumTransform(data);
				setAllData(transformed);
				setFilteredData(transformed);
			} catch (e) {
				console.log("Failed to load data: ", e);
			}
		};

		loadData();
	}, []);

	useEffect(() => {
		if (currentCategory == 0) {
			setFilteredData(allData);
			return;
		}
		const selectedCategoryName = options.find((opt) => opt.id === String(currentCategory))?.category;

		if (selectedCategoryName) {
			const filtered = allData.filter((item) => item.category.toLowerCase() === selectedCategoryName.toLowerCase());
			setFilteredData(filtered);
		}
	}, [filteredData, currentCategory]);

	return (
		<div className="px-10 py-8 flex-1 bg-orange-100">
			{/* select */}
			<div>
				<Select options={options} value={currentCategory} onChange={handleSelectChange} />
			</div>
			{/* search */}
			<div className="px-10 py-10 flex-1 "></div>
			{/* stat card - button */}
			<div className="flex flex-wrap justify-center gap-8 my-10 w-full"></div>
		</div>
	);
};

// VITE_REACT_APP_JSONPLACEHOLDER_SERVER_POSTS_URL=https://jsonplaceholder.typicode.com/posts
// VITE_REACT_APP_JSONPLACEHOLDER_SERVER_URL=https://jsonplaceholder.typicode.com

// VITE_REACT_APP_HYRULE_COMPENDIUM_URL=https://botw-compendium.herokuapp.com/api/v3
// VITE_REACT_APP_HYRULE_COMPENDIUM_REGIONS=/regions/all
// VITE_REACT_APP_HYRULE_COMPENDIUM_ALL_DATA=/compendium/all
// VITE_REACT_APP_HYRULE_COMPENDIUM_CREATURES=/compendium/category/creatures
// VITE_REACT_APP_HYRULE_COMPENDIUM_EQUIPMENT=/compendium/category/equipment
// VITE_REACT_APP_HYRULE_COMPENDIUM_MATERIALS=/compendium/category/materials
// VITE_REACT_APP_HYRULE_COMPENDIUM_MONSTERS=/compendium/category/monsters
// VITE_REACT_APP_HYRULE_COMPENDIUM_TREASURE=/compendium/category/treasure
