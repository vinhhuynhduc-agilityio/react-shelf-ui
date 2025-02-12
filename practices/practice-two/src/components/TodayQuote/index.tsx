const TodayQuote = () => {
  return (
    <div className="relative sm:max-w-[500px] md:max-w-[547px] max-w-[400px] h-[180px] sm:h-[200px] md:h-[233px] bg-gradient-to-tr from-[#EB5231] to-[#571FCF] bg-opacity-10 rounded-lg p-4 sm:p-5 md:p-6">
      <h2 className="text-white font-medium text-[20px] sm:text-[22px] md:text-[25px] leading-[28px] sm:leading-[30px] md:leading-[32px]">
        Today’s Quote
      </h2>
      <p className="text-white font-normal text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[28px] md:leading-[30px] mt-3 sm:mt-4">
        “There is more treasure in books than in all the pirate’s loot on Treasure Island.”
      </p>
      <p className="text-white font-normal text-[16px] sm:text-[18px] md:text-[20px] leading-[22px] sm:leading-[24px] md:leading-[26px] text-right mt-3 sm:mt-4">
        - Walt Disney
      </p>
    </div>
  );
};

export default TodayQuote;
