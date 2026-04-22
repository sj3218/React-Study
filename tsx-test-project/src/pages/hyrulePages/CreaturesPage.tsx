import { createRef, useEffect, useState, type ChangeEvent } from "react";
import { fetchCompendiumCreatures } from "../../api/hyrule/CompendiumService";
import { transformCreaturesData } from "../../utils/hyrule/CreaturesTransform";
import { type Creatures } from "../../types/hyrule/types";
import { SearchBar } from "../../components/common/test/SearchBar";
import { StatCardButton } from "../../components/common/test/StatCardButton";

export const CreaturesPage = () => {
	const [creatures, setCreature] = useState<Creatures[]>([]);
	const [result, setResult] = useState<Creatures[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [query, setQuery] = useState("");

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	useEffect(() => {
		const loadData = async () => {
			setError(false);
			setLoading(true);

			try {
				const data = await fetchCompendiumCreatures();
				const transformed = transformCreaturesData(data);
				setCreature(transformed);
				setResult(transformed);
			} catch (e) {
				console.log("Failed to load data: ", e);
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	useEffect(() => {
		if (!query.trim()) {
			setResult(creatures);
			return;
		}

		const filtered = creatures.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
		setResult(filtered);
	}, [query, creatures]);

	if (loading) {
		return <h1>loading...</h1>;
	}
	if (error) {
		return <h1>ERROR: cannot load data</h1>;
	}
	if (!creatures) {
		return <h1>no data...</h1>;
	}

	return (
		<div className="px-10 py-8 flex-1 bg-orange-100">
			{/* search */}
			<div className="px-10 py-10 flex-1 ">
				<SearchBar query={query} setQuery={handleInputChange} />
			</div>
			{/* stat card - button */}
			<div className="flex flex-wrap justify-center gap-8 my-10 w-full">
				{result.map((creature) => (
					<StatCardButton key={creature.id} item={creature} />
				))}
			</div>
		</div>
	);
};
