// app.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { getSession } from "./services/useSession.jsx";
import ScreenSizePanel from "./components/ui/ScreenSizePanel.jsx";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

export const ThemeContext = createContext({});
export const UserContext = createContext({});

export const darkThemePreference = () =>
  window.matchMedia("(prefers-color-scheme: light)").matches;

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  const [theme, setTheme] = useState(() =>
    darkThemePreference() ? "dark" : "light"
  );

  useEffect(() => {
    let themeInSession = getSession("theme");

    if (themeInSession) {
      setTheme(() => {
        document.body.setAttribute("data-theme", themeInSession);

        return themeInSession;
      });
    } else {
      document.body.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userAuth }}>
        {/* <ScreenSizePanel position={"bottom-left"} /> */}
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignInPage theme={theme} />} />
            <Route path="/register" element={<SignUpPage theme={theme} />} />
          </Routes>
        </Router>
      </UserContext.Provider>

      <ToastContainer />
    </ThemeContext.Provider>
  );
};

export default App;
