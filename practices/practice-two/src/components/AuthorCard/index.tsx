const AuthorCard = ({ name, bio }: { name: string; bio: string }) => (
	<div className="xl:w-[445px] xl:h-[418px] bg-white p-6 rounded-[10px]">
		<h3 className="text-[20px] font-semibold text-[#4D4D4D] mb-3">
			<span className="text-[#F27851]">About</span> Author
		</h3>
		<h4 className="text-[20px] text-[#4D4D4D] mb-8">{name}</h4>
		<p className="text-[13px] text-[#4D4D4D]">{bio}</p>
	</div>
);

export default AuthorCard;
