import { Outlet } from "react-router-dom";

// components
import { MenuSidebar, Header } from "@/components";

const MainLayout = () => {
	return (
		<div className="flex min-h-screen bg-gradient-to-r from-[#FA7C54] to-[#EC2C5A] p-6">
			<div className="flex w-full min-h-screen bg-[#F5F5F5] rounded-lg shadow-md overflow-hidden">
				<MenuSidebar />
				<div className="flex flex-col flex-1 w-full overflow-hidden">
					<Header />
					<main className="flex-grow p-6">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
};

export default MainLayout;
