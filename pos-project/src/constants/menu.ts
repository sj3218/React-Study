import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import { LayoutDashboard, Settings, FlaskConical } from "lucide-react";
import TestPage from "../pages/TestPage";

export const MENU_LIST = [
	{ id: 1, title: "Dashboard", url: "/", icon: LayoutDashboard, page: DashboardPage },
	{ id: 2, title: "Settings", url: "/settings", icon: Settings, page: SettingsPage },
	{ id: 3, title: "TestPage", url: "/testpage", icon: FlaskConical, page: TestPage },
];
