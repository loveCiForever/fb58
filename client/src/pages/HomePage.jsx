import { useContext, useEffect, useState } from "react";
import NavBar from "../components/layout/nav-bar/NavBar";
import { ThemeContext } from "../App";
import { UserContext } from "../App";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  LineChart,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import Footer from "../components/layout/footer/Footer";

import { useNavigate } from "react-router-dom";
const HomePage = () => {
  useEffect(() => {
    document.title = "Home Page";
  });

  const { theme } = useContext(ThemeContext);
  const { userAuth } = useContext(UserContext);
  const { isDark } = useState("dark");
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col items-center min-h-screen ${
        theme == "light" ? "bg-white" : "bg-black/90"
      }`}
    >
      <NavBar theme={theme} />
    </div>
  );
};

export default HomePage;
