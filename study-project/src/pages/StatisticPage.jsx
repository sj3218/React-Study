import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";
import DoughnutChart from "../components/charts/DoughnutChart";

const Text = styled.div`
	font-size: 14px;
`;
const Button = styled.button`
	color: #bf4f74;
	font-size: 1em;
	margin: 1em;
	padding: 0.25em 1em;
	border: 3px solid #bf4f74;
	border-radius: 3px;
	height: 50px;
	&:hover {
		background: #cacaca;
	}
`;

function StatisticsPage() {
	console.log(process.env.REACT_APP_JSONPLACEHOLDER_SERVER_TODOS_URL);
	const [allTodos, setAllTodos] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(1);
	const [currData, setCurrData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setAllTodos(null);
				const response = await axios.get(process.env.REACT_APP_JSONPLACEHOLDER_SERVER_TODOS_URL);
				setAllTodos(response.data);
			} catch (e) {}
		};
		fetchData();
	}, []);

	if (!allTodos) {
		return <Text>no data...</Text>;
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
		setSelectedUserId(id);
	};

	const chart_data = [
		{ name: "total", value: statsByUserId[selectedUserId].total },
		{ name: "done", value: statsByUserId[selectedUserId].done },
		{ name: "undone", value: statsByUserId[selectedUserId].undone },
	];

	return (
		<>
			<Button onClick={onClick} id="1">
				user 1
			</Button>
			<DoughnutChart title={selectedUserId} size="250" data={chart_data} />
		</>
	);
}

export default StatisticsPage;
