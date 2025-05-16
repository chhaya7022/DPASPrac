
import React from "react";

const Header = () => {
  return (
    <header className="bg-blue-600 w-full text-white py-1 fixed top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/Images/HeaderImgITGARSH.jpg" 
            alt="AMTRON Logo" 
            className="h-10 w-10" 
          />
          <div className="flex flex-col">
            <h1 className="text-base font-bold">Assam Electronics Development Corporation Ltd.</h1>
            <p className="text-xs">A Govt. of Assam Undertaking</p>
          </div>
        </div>
        <div>
          <div className="w-8 h-8 bg-blue-500 rounded-full overflow-hidden border-2 border-white">
            <img
              src="https://i.pravatar.cc/100"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
