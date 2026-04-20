import { Layout } from "../components/layouts/Layout";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MENU_LIST } from "../constants/menu";

interface RouterProps {
	title: string;
}
export const Router = ({ title }: RouterProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<Routes>
			<Route element={<Layout title={title} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}>
				{MENU_LIST.map((menu) => (
					<Route key={menu.id} path={menu.url} element={<menu.page />} />
				))}
				<Route path="*" element={<Navigate replace to="/" />} />
			</Route>
		</Routes>
	);
};
