const FootballField = () => {
  return (
    <div className={`w-full max-w-4xl mx-auto my-8`}>
      <div className="absolute inset-0 flex flex-col">
        {/* Center line */}
        <div className="absolute left-1/2 -top-10 bottom-0 w-[2px] bg-white -translate-x-1/2 my-20"></div>

        {/* Center circle */}
        <div className="absolute left-1/2 top-1/2 w-[20%] aspect-square rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2"></div>

        {/* Center spot */}
        <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"></div>

        {/* Left penalty spot */}
        <div className="absolute left-[9%] top-1/2 w-2 h-2 rounded-full bg-white -translate-y-1/2"></div>

        {/* Right penalty spot */}
        <div className="absolute right-[9%] top-1/2 w-2 h-2 rounded-full bg-white -translate-y-1/2"></div>

        {/* Left penalty arc */}
        <div className="absolute left-[0%] top-1/2 w-[10%] h-[30%] border-2 border-l-0 border-white rounded-r-full -translate-y-1/2"></div>

        {/* Right penalty arc */}
        <div className="absolute right-[0%] top-1/2 w-[10%] h-[30%] border-2 border-r-0 border-white rounded-l-full -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default FootballField;
