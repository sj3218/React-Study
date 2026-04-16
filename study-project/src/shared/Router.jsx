import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import TodoPage from "../pages/TodoPage";
import InfoPage from "../pages/InfoPage";
import Layout from "../components/layouts/Layout";
import AnimalCrossingPage from "../pages/AnimalCrossingPage";
import PostPage from "../pages/PostPage";
import StatisticsPage from "../pages/StatisticPage";
import NonogramPage from "../pages/NonogramPage";

function Router({ title, footerMessage }) {
	const menuList = [
		{ menu_id: 1, title: "HomePage", url: "/", page: HomePage },
		{ menu_id: 2, title: "LoginPage", url: "/login", page: LoginPage },
		{ menu_id: 3, title: "TodoPage", url: "/todos", page: TodoPage },
		{ menu_id: 4, title: "InfoPage", url: "/info/:id", page: InfoPage },
		{ menu_id: 5, title: "AnimalCrossingPage", url: "/animal-crossing", page: AnimalCrossingPage },
		{ menu_id: 6, title: "PostPage", url: "/posts", page: PostPage },
		{ menu_id: 7, title: "StatisticsPage", url: "/statistics", page: StatisticsPage },
		{ menu_id: 8, title: "NonogramPage", url: "/nonogram", page: NonogramPage },
	];
	return (
		<Routes>
			<Route element={<Layout title={title} footerMessage={footerMessage} menuList={menuList} />}>
				{menuList.map((menu) => (
					<Route key={menu.menu_id} path={menu.url} element={<menu.page />} />
				))}

				{/* <Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/todos" element={<TodoPage />} />
				<Route path="/info/:id" element={<InfoPage />} /> */}

				<Route path="*" element={<Navigate replace to="/" />} />
			</Route>
		</Routes>
	);
}

export default Router;
