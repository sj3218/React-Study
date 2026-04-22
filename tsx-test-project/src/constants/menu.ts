import type React from "react";
import { LayoutDashboard, Settings, FlaskConical, type LucideIcon, Joystick } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import TestPage from "../pages/TestPage";
import { CreaturesPage } from "../pages/hyrulePages/CreaturesPage";
import { HyrulePage } from "../pages/hyrulePages/HyrulePage";

interface MenuItem {
	id: string;
	title: string;
	url: string;
	icon: LucideIcon;
	page: React.ComponentType;
}

export const MENU_LIST: MenuItem[] = [
	{ id: uuidv4(), title: "Dashboard", url: "/", icon: LayoutDashboard, page: DashboardPage },
	{ id: uuidv4(), title: "Settings", url: "/settings", icon: Settings, page: SettingsPage },
	{ id: uuidv4(), title: "TestPage", url: "/testpage", icon: FlaskConical, page: TestPage },
	{ id: uuidv4(), title: "HyrulePage", url: "/hyrule-page", icon: Joystick, page: HyrulePage },
	{ id: uuidv4(), title: "Creatures", url: "/creaturespage", icon: FlaskConical, page: CreaturesPage },
];
