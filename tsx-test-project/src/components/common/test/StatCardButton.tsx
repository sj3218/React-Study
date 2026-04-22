import { useState } from "react";
import type { BaseItem } from "../../../types/hyrule/types";
import { TestModal } from "./TestModal";

export const StatCardButton = ({ item }: { item: BaseItem }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button onClick={() => setOpen(true)} className="w-[250px] h-[300px] flex-shrink-0 rounded-[20px] p-6 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-105 transition-transform">
				<img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-[10px]" />
				<h3 className="mt-2 font-bold font-sans text-lg">{item.name.toUpperCase()}</h3>
				<p className="mt-2 font-bold text-xs">id: {item.id}</p>
			</button>

			<TestModal isOpen={open} onClose={() => setOpen(false)}>
				<div className="bg-orange-100 flex-shrink-0 rounded-[20px] p-5 flex flex-col">
					<img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-[10px]" />
					<h3 className="mt-2 font-bold font-sans text-lg text-center">{item.name.toUpperCase()}</h3>
					<p className="mt-2 font-regular  text-xs">{item.description}</p>
					<div className="mt-5 w-full bg-orange-200/50 rounded-[20px] p-4">
						<h4 className="font-bold text-sm text-orange-800 mb-1">Common Location</h4>
						<p className="text-sm text-orange-900">{item.common_locations?.length ? item.common_locations.join(", ") : "Unknown"}</p>
					</div>
				</div>
			</TestModal>
		</>
	);
};
