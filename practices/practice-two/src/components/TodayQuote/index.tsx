const TodayQuote = () => {
  return (
    <div className="relative sm:max-w-[400px] md:max-w-[547px] max-w-[400px] h-[160px] sm:h-[180px] md:h-[233px] bg-gradient-to-tr from-[#EB5231] to-[#571FCF] bg-opacity-10 rounded-lg p-4 sm:p-4 md:p-6">
      <h2 className="text-white font-medium text-[18px] sm:text-[20px] md:text-[25px] leading-[24px] sm:leading-[28px] md:leading-[32px]">
        Today’s Quote
      </h2>
      <p className="text-white font-normal text-[14px] sm:text-[16px] md:text-[20px] leading-[20px] sm:leading-[24px] md:leading-[30px] mt-3 sm:mt-4">
        “There is more treasure in books than in all the pirate’s loot on Treasure Island.”
      </p>
      <p className="text-white font-normal text-[14px] sm:text-[16px] md:text-[20px] leading-[18px] sm:leading-[22px] md:leading-[26px] text-right mt-3 sm:mt-4">
        - Walt Disney
      </p>
    </div>
  );
};

export default TodayQuote;
