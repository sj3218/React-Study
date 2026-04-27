export const Footer = () => {
	return (
		<footer className="px-10 py-8 border-t border-[#E2E8F0] mt-12 bg-white/50 backdrop-blur-sm">
			<div className="flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="flex flex-col items-center md:items-start gap-1">
					<p className="text-xs font-bold text-[#1E293B]">Sejeong Portfolio</p>
					<p className="text-[10px] text-[#64748B] font-medium tracking-wide">© {new Date().getFullYear()} Corporate Analytics Division. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};
