import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.title = "Dashboard";
  });

  return (
    <>
      <div
        className={`${
          isScrolled ? "shadow-2xl" : ""
        } relative sm:fixed w-full top-0 z-10 `}
      >
        <Header />

        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Dashboard;
