import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import { MENU_LIST } from "./constants/menu";

// export const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route element={<Layout />}>

//       {/* {MENU_LIST.map((menu) => (
//         <Route key={menu.id} path={menu.url} element={<menu.page />} />
//       ))} */}
//       <Route path="*" element={<Navigate replace to="/" />} />
//     </Route>,
//   ),
// );
export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<Layout />}>
			{MENU_LIST.flatMap((group) =>
				group.children.map((menu) => {
					const Page = menu.page;
					return <Route key={menu.id} path={menu.pathPattern} element={<Page />} />;
				}),
			)}
			<Route path="*" element={<Navigate replace to="/" />} />
		</Route>,
	),
);
