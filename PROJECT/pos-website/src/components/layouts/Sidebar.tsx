import { useState } from "react";
import { MENU_LIST } from "../../constants/menu";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import logoIMG from "../../assets/images/img_login_logo_daeguro.png";

export const Sidebar = () => {
	const location = useLocation();
	const [openMenuID, setOpenMenuID] = useState<string | null>("");
	const toggleMenu = (id: string) => {
		setOpenMenuID(openMenuID == id ? null : id);
	};

	return (
		<div className="flex flex-col h-full w-64 bg-white border-r border-slate-100 shadow-lg">
			<div className="p-6 flex items-center justify-center border-b border-slate-50">
				<img src={logoIMG} alt="로고 이미지" className="h-18 w-auto object-contain" />
			</div>

			<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
				{MENU_LIST.map((menu) => {
					const isOpen = openMenuID === menu.id;
					const MenuIcon = menu.icon;

					return (
						<div key={menu.id} className="space-y-1">
							<button onClick={() => toggleMenu(menu.id)} className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-200">
								<div className="flex items-center gap-3">
									<MenuIcon className="w-6 h-6 text-slate-500" />
									<span className="text-lg font-bold text-slate-800">{menu.title}</span>
								</div>
								{isOpen ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
							</button>

							<div className={`pl-9 space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
								{menu.children.map((sub, subIdx) => {
									const isActive = location.pathname === sub.url;

									return (
										<Link to={sub.url} key={subIdx} className="block">
											<div
												className={`px-4 py-2 rounded-md text-base font-semibold transition-colors duration-200 ${
													isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900" // 마우스 호버 시 연한 회색
												}`}
											>
												{sub.title}
											</div>
										</Link>
									);
								})}
							</div>
						</div>
					);
				})}
			</nav>
		</div>
	);
};
