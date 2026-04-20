import { useEffect, useState } from "react";
import axios from "axios";
import { DoughnutChart } from "../components/charts/DoughnutChart";
import { StandardBar } from "../components/charts/StandardBar";
import { fetchAllTodos } from "../api/todoService";
import { transformTodoStats } from "../utils/DataTransform";

const TestPage = () => {
	const [allTodos, setAllTodos] = useState<any>(null);
	const [selectedUserId, setSelectedUserId] = useState(1);
	// const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await fetchAllTodos();
				const transformed = transformTodoStats(data);
				setAllTodos(transformed);
			} catch (e) {
				console.log("Failed to load data: ", e);
			}
		};
		loadData();
	}, []);

	if (!allTodos) {
		return <h1>no data ... </h1>;
	}

	const currentUserData = [
		{ name: "done", value: allTodos[selectedUserId]?.done || 0 },
        { name: "undone", value: allTodos[selectedUserId]?.undone || 0 },
	];
const uniqueUserIds = Object.keys(allTodos).map(Number);

	//const uniqueUserIds = Array.from(new Set(allTodos.map((d) => d.userId)));

	return (
		<div className="px-10 py-8 flex-1">
			<div className="flex gap-2 flex-wrap">
                {uniqueUserIds.map((userId) => (
                    <button 
                        key={userId}
                        className={`py-2 px-4 border rounded ${
                            selectedUserId === userId 
                            ? "bg-blue-500 text-white" 
                            : "bg-transparent text-blue-700 border-blue-500"
                        }`}
                        onClick={() => setSelectedUserId(userId)}
                    >
                        User {userId}
                    </button>
                ))}
            </div>
			{/* <div className="flex gap-2 flex-wrap">
				{uniqueUserIds.map((userId) => (
					<button className="max-w-[200px] bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => onClick(userId)}>
						Button {userId}
					</button>
				))}
			</div> */}
			<div className="my-10 grid grid-cols-1 lg:grid-cols-1 gap-8 w-full">
				<DoughnutChart title={`Chart- ${selectedUserId}`} data={currentUserData} />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<StandardBar title={`BarChart- ${selectedUserId}`} axis="x" data={currentUserData} />
				<StandardBar title={`BarChart- ${selectedUserId}`} axis="y" data={currentUserData} />
			</div>
		</div>
	);
};

export default TestPage;
