import { useState } from "react";
import text_logo from "../../assets/logos/text_logo.png";
import menu from "../../assets/icons/black/menu.svg";
import close from "../../assets/icons/black/close.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isClickMenu, setIsClickMenu] = useState("false");
  const navigate = useNavigate();

  return (
    <>
      <header className="h-[70px] bg-white">
        <div className="flex w-full h-full px-6 ">
          <div className="flex items-center w-full max-lg:justify-between ">
            <button
              className="flex items-center p-2 cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              <img src={text_logo} alt="logo" className="w-16" />
            </button>
            <div className="flex justify-between w-full pl-6 max-lg:hidden ">
              <div className="flex gap-2">
                <button
                  className={`btn-hover-gray ${
                    window.location.pathname == "/schedule"
                      ? "btn-selected"
                      : ""
                  }`}
                  onClick={() => navigate("/schedule")}
                >
                  Schedule
                </button>
                <button
                  className={`btn-hover-gray ${
                    window.location.pathname == "/dashboard"
                      ? "btn-selected"
                      : ""
                  }`}
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  className="btn-hover-gray"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
                <button
                  className="btn-black"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </div>
            </div>
            <div
              className="right-0 hidden cursor-pointer max-lg:block"
              onClick={() => setIsClickMenu(!isClickMenu)}
            >
              {!isClickMenu ? (
                <img src={close} alt="icon-close" />
              ) : (
                <img src={menu} alt="icon-menu" />
              )}
            </div>
          </div>
        </div>
        <div
          className={`hidden absolute w-[170px] h-auto py-4 top-16 right-6 rounded-2xl border-[0.5px] border-gray-300 shadow-2xl bg-white z-10 ${
            isClickMenu ? "hidden " : "max-lg:block"
          }  `}
        >
          <div className="px-4 font-semibold ">
            <div
              className="py-2 border-gray-300 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate("/schedule")}
            >
              Schedule
            </div>
            <div
              className="py-2 border-gray-300 cursor-pointer border-t-1 hover:bg-gray-100"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </div>
          </div>
          <div className="flex flex-col w-full gap-2 px-4 pt-4 bg-white border-gray-300 ">
            <button
              className="text-center btn-black"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button
              className="text-center btn-black-outline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
