import { Layout } from "./components/layouts/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import { MENU_LIST } from "./constants/menu";
import { CreatureDetailPage } from "./pages/hyrulePages/CreatureDetailPage";

export const Router = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				{MENU_LIST.map((menu) => (
					<Route key={menu.id} path={menu.url} element={<menu.page />} />
				))}
				<Route path="/creatures/:id" element={<CreatureDetailPage/>}/>
				<Route path="*" element={<Navigate replace to="/" />} />
			</Route>
		</Routes>
	);
};
