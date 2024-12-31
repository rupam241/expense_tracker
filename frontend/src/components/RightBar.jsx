import React from "react";
import { Outlet } from "react-router-dom";

const RightBar = () => {
  return (
    <div className="w-full h-[92vh] bg-customPink border-2 rounded-lg  ">
      {/* Render child components */}
      <Outlet />
    </div>
  );
};

export default RightBar;