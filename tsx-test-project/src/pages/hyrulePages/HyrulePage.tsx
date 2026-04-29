import { useEffect, useState, type ChangeEvent } from "react";
import { type Creature, type Equipment, type BaseItem, type Material, type Monster, type Treasure } from "../../types/hyrule/types";
import { fetchAllCompendium, fetchCompendiumCreatures, fetchCompendiumEquipment, fetchCompendiumMaterials, fetchCompendiumMonsters, fetchCompendiumTreasure } from "../../api/hyrule/CompendiumService";
import { transformCompendiumTransform } from "../../utils/hyrule/CompendiumTransform";
import { v4 as uuidv4 } from "uuid";
import { Select } from "../../components/common/test/Select";
import { transformCreaturesData } from "../../utils/hyrule/CreaturesTransform";
import { transformEquipmentsData, transformMaterialsData, transformMonstersData, transformTreasuresData } from "../../utils/hyrule/HyruleTransform";
import { HyruleStatCard } from "../../components/common/test/HyruleStatCard";

const options = [
	// { id: uuidv4(), category: "Total" },
	{ id: uuidv4(), category: "Creatures" },
	{ id: uuidv4(), category: "Equipment" },
	{ id: uuidv4(), category: "Materials" },
	{ id: uuidv4(), category: "Monsters" },
	{ id: uuidv4(), category: "Treasure" },
];

export const HyrulePage = () => {
	const [creaturesData, setCreatureData] = useState<Creature[]>([]);
	const [equipmentData, setEquipmentsData] = useState<Equipment[]>([]);
	const [materialData, setMaterialData] = useState<Material[]>([]);
	const [monsterData, setMonsterData] = useState<Monster[]>([]);
	const [treasureData, setTreasureData] = useState<Treasure[]>([]);
	const [currentIdx, setCurrentIdx] = useState(1);

	const [loading, setLoading] = useState(false);
	const [error,setError] = useState(false);

	const [allData, setAllData] = useState<any[]>([]);
	const [filteredData, setFilteredData] = useState<any[]>([]);
	const [currentCategory, setCurrentCategory] = useState("");

	const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setCurrentCategory(e.target.value);
		console.log(e.target.value);
	};

	useEffect(() => {
		const loadData = async () =>{

			try{
				const storedCreature = sessionStorage.getItem("creaturesData");
				if(!storedCreature)
				{
					const creature = await fetchCompendiumCreatures();
					setCreatureData(creature);
				}
				else
				{
					const creature_json = JSON.parse(storedCreature);
					const data = transformCreaturesData(creature_json);
					setCreatureData(data);
				}

				const storedEquipment = sessionStorage.getItem("equipmentsData");
				if(!storedEquipment)
				{
					const equipment = await fetchCompendiumEquipment();
					setEquipmentsData(equipment);
				}
				else{
					const equipment_json = JSON.parse(storedEquipment);
					const data = transformEquipmentsData(equipment_json);
					setEquipmentsData(data);
				}

				const storedMaterial = sessionStorage.getItem("materialsData");
				if(!storedMaterial)
				{
					const material = await fetchCompendiumMaterials();
					setMaterialData(material);
				}
				else{
					const material_json = JSON.parse(storedMaterial);
					const data = transformMaterialsData(material_json);
					setMaterialData(data);
				}

				const storedMonster = sessionStorage.getItem("monstersData");
				if(!storedMonster)
				{
					const monster = await fetchCompendiumMonsters();
					setMonsterData(monster);
				}
				else{
					const monster_json = JSON.parse(storedMonster);
					const data = transformMonstersData(monster_json);
					setMonsterData(data);
				}
				const storedTreasure = sessionStorage.getItem("treasuresData");
				if(!storedTreasure)
				{
					const treasure = await fetchCompendiumTreasure();
					setTreasureData(treasure);
				}
				else{
					const treasure_json = JSON.parse(storedTreasure);
					const data = transformTreasuresData(treasure_json);
					setTreasureData(data);
				}
				// const creature = await fetchCompendiumCreatures();
				// setCreatureData(creature);
				// const equipment = await fetchCompendiumEquipment();
				// setEquipmentsData(equipment);
				// const material = await fetchCompendiumMaterials();
				// setMaterialData(material);
				// const monster = await fetchCompendiumMonsters();
				// setMonsterData(monster);
				// const treasure = await fetchCompendiumTreasure();
				// setTreasureData(treasure);
			}
			catch(e)
			{
				console.log("error: ", e);
			}
			
		};
		loadData();
	},[]);

	// useEffect(() => {
	// 	const loadData = async () => {
	// 		try {
	// 			const data = await fetchAllCompendium();
	// 			const transformed = transformCompendiumTransform(data);
	// 			setAllData(transformed);
	// 			setFilteredData(transformed);
	// 		} catch (e) {
	// 			console.log("Failed to load data: ", e);
	// 		}
	// 	};

	// 	loadData();
	// }, []);

	// useEffect(() => {
	// 	if (currentCategory == "") {
	// 		setFilteredData(allData);
	// 		return;
	// 	}
	// 	const selectedCategoryName = options.find((opt) => opt.id === String(currentCategory))?.category;

	// 	if (selectedCategoryName) {
	// 		const filtered = allData.filter((item) => item.category.toLowerCase() === selectedCategoryName.toLowerCase());
	// 		setFilteredData(filtered);
	// 	}
	// }, [filteredData, currentCategory]);

	const renderContent = () =>{
		switch(currentCategory)
		{
			case "Creatures":{
				return (creaturesData.map((creature) => (
				<HyruleStatCard key={creature.id} item={creature}/>
			)))};
			break;
			case "Equipment":{
				return (equipmentData.map((equipment) => (
					<HyruleStatCard key ={equipment.id} item = {equipment}/>
				)))};
				break;
			case "Materials":{
				return (materialData.map((material) => (
					<HyruleStatCard key ={material.id} item = {material}/>
				)))};
				break;
			case "Monsters":{
				return (monsterData.map((monster) => (
					<HyruleStatCard key ={monster.id} item = {monster}/>
				)))};
				break;
			case "Treasure":{
				return (treasureData.map((treasure) => (
					<HyruleStatCard key ={treasure.id} item = {treasure}/>
				)))};
				break;
		}
	}
	return (
		<div className="px-10 py-8 flex-1 bg-[#0F172A] text-white">
			{/* select */}
			<div>
				<Select options={options} value={currentCategory} onChange={handleSelectChange} />
			</div>
			{/* search */}
			<div className="px-10 py-10 flex-1 "></div>
			{/* stat card - button */}
			{/* 기존 방식 대신 이 방식을 사용해 보세요 */}
			<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
  				{renderContent()}
			</div>
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
