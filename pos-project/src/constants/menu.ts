import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import { LayoutDashboard, Settings, FlaskConical, type LucideIcon } from "lucide-react";
import TestPage from "../pages/TestPage";
import type React from "react";


interface MenuItem {
	id: number;
	title: string;
	url: string;
	icon: LucideIcon;
	page: React.ComponentType;
}

export const MENU_LIST : MenuItem[] = [
	{ id: 1, title: "Dashboard", url: "/", icon: LayoutDashboard, page: DashboardPage },
	{ id: 2, title: "Settings", url: "/settings", icon: Settings, page: SettingsPage },
	{ id: 3, title: "TestPage", url: "/testpage", icon: FlaskConical, page: TestPage },
];
