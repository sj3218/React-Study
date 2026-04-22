import { useEffect, useState, type ChangeEvent } from "react";
import { DoughnutChart } from "../components/charts/DoughnutChart";
import { StandardBar } from "../components/charts/StandardBar";
import { fetchAllTodos } from "../api/todoService";
import { transformTodoStats, transformTodoStatsFromTo } from "../utils/DataTransform";
import { CommonCalendar } from "../components/common/calendar/CommonCalendar";
import { TestButton } from "../components/common/test/TestButton";
import { PDFButton } from "../components/common/buttons/PDFButton";

interface Inputs {
	begin: number;
	end: number;
}

const TestPage = () => {
	const [allTodos, setAllTodos] = useState<any>(null);
	const [selectedUserId, setSelectedUserId] = useState(1);
	const [chartData, setChartData] = useState<any[]>([]);
	const [title, setTitle] = useState("");

	const [inputs, setInputs] = useState<Inputs>({
		begin: 1,
		end: 1,
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputs({
			...inputs,
			[name]: Number(value),
		});
	};

	const handleCheck = () => {
		const { begin, end } = inputs;

		if (begin < 1 || end > 10 || begin > end) {
			alert("enter betwenn 1 and 10, left value must be smaller than right value");
			return;
		}

		const filteredResult = transformTodoStatsFromTo(allTodos, begin, end);
		setChartData([
			{ name: "done", value: filteredResult.done },
			{ name: "undone", value: filteredResult.undone },
		]);
		setTitle(`from ${begin} to ${end}`);
	};

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

	const uniqueUserIds = Object.keys(allTodos).map(Number);

	return (
		<div className="px-10 py-8 flex-1">
			<PDFButton data={allTodos} />
			<div className="flex gap-2 my-2.5 flex-wrap">
				<TestButton inputs={inputs} onChange={handleInputChange} onCheck={handleCheck} />
			</div>
			<div className="flex gap-2 my-2.5 flex-wrap">
				<CommonCalendar />
			</div>
			<div className="flex gap-2 flex-wrap">
				{uniqueUserIds.map((userId) => (
					<button
						key={userId}
						className={`py-2 px-4 border rounded ${selectedUserId === userId ? "bg-blue-500 text-white" : "bg-transparent text-blue-700 border-blue-500"}`}
						onClick={() => {
							setSelectedUserId(userId);
							const currentUserData = [
								{ name: "done", value: allTodos[selectedUserId]?.done || 0 },
								{ name: "undone", value: allTodos[selectedUserId]?.undone || 0 },
							];
							console.log(currentUserData[0].value, currentUserData[1].value);
							setChartData(currentUserData);
							setTitle(String(selectedUserId));
						}}
					>
						User {userId}
					</button>
				))}
			</div>
			<div className="my-10 grid grid-cols-1 lg:grid-cols-1 gap-8 w-full">
				<DoughnutChart title={`Chart- ${title}`} data={chartData} />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<StandardBar title={`BarChart- ${title}`} axis="x" data={chartData} />
				<StandardBar title={`BarChart- ${title}`} axis="y" data={chartData} />
			</div>

			<div className="block-30 grid grid-cols-1 lg:grid-colos-4 gap-1">
				<div className="bg-red-100" />
				<div className="bg-red-200" />
				<div className="bg-red-300" />
				<div className="bg-red-400" />
			</div>
		</div>
	);
};

export default TestPage;
