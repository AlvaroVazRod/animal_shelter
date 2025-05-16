import React from "react";
import Main from "../../components/Main";
import PawBtton from "../../components/PawBtton";
import Login from "../../components/Login";
import Register from "../../components/Register";
export const MainPage = () => {
  return (
    <div
      className="relative z-0 min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundImage: "url('./mainBg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Main />
    </div>
  );
};
export default MainPage;
