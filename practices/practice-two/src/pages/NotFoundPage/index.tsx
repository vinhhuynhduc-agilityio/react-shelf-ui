const NotFoundPage = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen text-center p-4">
			<img
				src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
				alt="404 Not Found"
				className="w-64 h-64 mb-6"
			/>
			<h1 className="text-3xl font-bold text-red-600 mb-2">
				404 - Page Not Found
			</h1>
			<p className="text-gray-600">
				Oops! The page you’re looking for doesn’t exist.
			</p>
		</div>
	);
};

export default NotFoundPage;
