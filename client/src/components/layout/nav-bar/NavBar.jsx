// athStock/client/src/components/navbar/NavBar.jsx

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";

import LogoButton from "../../ui/buttons/LogoButton.jsx";
import PageButton from "../../ui/buttons/NavButtonForHeader.jsx";
import LoggedUser from "../user-panel/UserImage.jsx";

import HamburgerIcon from "../../../assets/icons/hamburger.svg";

import { UppercaseFirstLetterEachWord } from "../../../utils/formatText.jsx";
import { getBasePath } from "../../../utils/splitPath.jsx";
import { toast } from "react-toastify";
import axios from "axios";
function NavBar({ theme }) {
  const { user, loading, signout } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [toggleMenuDropdown, setToggleMenuDropdown] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  let [currentBasePath, setCurrentBasePath] = useState(null);

  const VITE_BASE_URL = import.meta.env.VITE_REMOTE_API_SERVER;

  const authHeaders = user
    ? { headers: { Authorization: `Bearer ${user.access_token}` } }
    : {};
  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentBasePath, window.innerWidth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleBasePathChange = () => {
    setCurrentBasePath(getBasePath(window.location.pathname));
  };

  // const email = user.email;
  const signOut = async () => {
    // console.log("SIGN OUT");
    try {
      console.log(authHeaders);
      await axios.post(`${VITE_BASE_URL}/api/auth/signout`, {}, authHeaders);
      toast.success("Sign out successful");
      signout();
    } catch (error) {
      toast.error("Error signing out");
      console.log(error);
    }
  };

  useEffect(() => {
    handleBasePathChange();
  }, [currentBasePath]);

  if (loading) {
    return <div className="w-full h-screen bg-red-500">LOADING ...</div>;
  }

  // useEffect(() => {
  //   console.log(theme);
  // }, [theme]);

  return (
    <nav
      className={`navbar flex md:fixed w-full items-center justify-between h-[60px] md:h-[80px] xl:h-[100px] px-6 sm:px-10 md:px-14 xl:px-40 z-50 bg-gray-300 ${
        theme == "light" ? "bg-white text-black" : "bg-black/10 text-white"
      } transition-shadow duration-300 ${
        isScrolled ? "shadow-sm shadow-gray-300" : "null"
      }`}
    >
      <LogoButton
        theme={theme}
        navigateTo={"/"}
        forHeader={true}
        forFooter={false}
      />

      <div className="w-full ">
        <div className="flex items-center justify-end gap-4 sm:gap-10 xl:gap-16">
          {currentBasePath == "blog" || currentBasePath == "editor" ? (
            <PageButton
              currentBasePath={currentBasePath}
              navigateTo={"/editor"}
              name={"Publish Blog"}
              solid={true}
            />
          ) : (
            ""
          )}
          <PageButton
            currentBasePath={currentBasePath}
            navigateTo={"/"}
            name={"Home"}
            solid={false}
          />
          <PageButton
            currentBasePath={currentBasePath}
            navigateTo={"/schedule"}
            name={"Schedule"}
            solid={false}
          />
          {!user ? (
            <div>
              <button
                className={`home-btn text-md lg:text-lg font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all`}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </button>
            </div>
          ) : (
            <LoggedUser theme={theme} />
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
