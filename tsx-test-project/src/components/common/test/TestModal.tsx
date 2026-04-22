import type { ReactNode } from "react";

export const TestModal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) => {
	if (!isOpen) return null;

	return (
		//modal-overlay
		<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
			{/* modal */}
			<div className="rounded-[30px] p-2 relative shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
};
