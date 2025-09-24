export default function Footer() {
	return (
		<footer className="relative mt-10 bg-[#F3F4F6] border-t border-[#E5E7EB]">
			<div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center gap-4 justify-between text-[#374151]">
				<p>© {new Date().getFullYear()} Virtual Homeopathy</p>
				<nav className="flex gap-5">
					<a href="/ebooks" className="hover:text-[#1E3A8A]">Ebooks</a>
					<a href="/youtube" className="hover:text-[#1E3A8A]">Videos</a>
					<a href="/account" className="hover:text-[#1E3A8A]">Account</a>
				</nav>
			</div>
		</footer>
	);
}
