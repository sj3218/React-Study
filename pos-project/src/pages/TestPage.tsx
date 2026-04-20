import { useEffect, useState } from "react";
import axios from "axios";
import { DoughnutChart } from "../components/charts/Doughnutchart";
import { StandardBar } from "../components/charts/StandardBar";

const TestPage = () => {
	const [allTodos, setAllTodos] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(1);
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setAllTodos(null);
				const response = await axios.get(import.meta.env.VITE_REACT_APP_JSONPLACEHOLDER_SERVER_TODOS_URL);
				setAllTodos(response.data);
			} catch (e) {}
		};
		fetchData();
	}, []);

	if (!allTodos) {
		return <h1>no data ... </h1>;
	}

	const statsByUserId = allTodos.reduce((acc, cur) => {
		const { userId, completed } = cur;
		if (!acc[userId]) {
			acc[userId] = { total: 0, done: 0, undone: 0 };
		}

		acc[userId].total++;
		if (completed) {
			acc[userId].done++;
		} else {
			acc[userId].undone++;
		}
		return acc;
	}, {});

	const onClick = (id) => {
		console.log(id);
		setSelectedUserId(id);
		const data = [
			{ name: "done", value: statsByUserId[selectedUserId].done },
			{ name: "undone", value: statsByUserId[selectedUserId].undone },
		];
		setChartData(data);
	};

	const uniqueUserIds = Array.from(new Set(allTodos.map((d) => d.userId)));

	return (
		<div className="px-10 py-8 flex-1">
			<div className="flex gap-2 flex-wrap">
				{uniqueUserIds.map((userId) => (
					<button className="max-w-[200px] bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => onClick(userId)}>
						Button {userId}
					</button>
				))}
			</div>
			<div className="my-10 grid grid-cols-1 lg:grid-cols-1 gap-8 w-full">
				<DoughnutChart title={`Chart- ${selectedUserId}`} data={chartData} />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<StandardBar title={`BarChart- ${selectedUserId}`} axis="x" data={chartData} />
				<StandardBar title={`BarChart- ${selectedUserId}`} axis="y" data={chartData} />
			</div>
		</div>
	);
};

export default TestPage;
