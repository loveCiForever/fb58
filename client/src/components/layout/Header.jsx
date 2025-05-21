import { useState } from "react";
import text_logo from "../../assets/logos/text_logo.png";
import menu from "../../assets/icons/black/menu.svg";
import close from "../../assets/icons/black/close.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, UserRoundPen, LogOut } from "lucide-react";
const Header = () => {
  const [isClickMenu, setIsClickMenu] = useState("false");
  const navigate = useNavigate();
  const [toggleUserPanel, setToggleUserPanel] = useState(false);

  const { user } = useAuth();
  const admin = "";

  // console.log(user);

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
                {user && (
                  <button
                    className={`btn-hover-gray ${
                      window.location.pathname == "/my_bookings"
                        ? "btn-selected"
                        : ""
                    }`}
                    onClick={() => navigate("/my_bookings")}
                  >
                    My booking
                  </button>
                )}
                {admin && (
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
                )}
              </div>

              {user ? (
                <div>
                  {" "}
                  <button
                    className="p-2 border-1 border-gray-400 rounded-full"
                    onClick={() => setToggleUserPanel(!toggleUserPanel)}
                  >
                    <User />
                  </button>
                  {toggleUserPanel && (
                    <div className="absolute top-16 right-7 rounded-md w-[230px] border-[1px] py-4 border-gray-300 bg-white shadow-xl z-50">
                      <div className="cursor-pointer px-4">
                        <h1 className="text-lg font-bold">{user.name}</h1>
                        <h2 className="text-sm hover:text-blue-600 font-medium">
                          {user.email}
                        </h2>
                      </div>

                      <div className="w-full h-[1px] bg-gray-300 my-4" />

                      <button className="flex items-center gap-3 hover:bg-gray-200 w-full px-4 text-start py-2">
                        <UserRoundPen size={20} /> <h1>My profile</h1>
                      </button>
                      <button className="flex items-center gap-3 hover:bg-gray-200 w-full px-4 text-start py-2">
                        <LogOut size={20} /> <h1>Logout</h1>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
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
              )}
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
