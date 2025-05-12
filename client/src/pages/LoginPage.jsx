import video_frame_login from "../assets/images/login.jpg";
import text_logo from "../assets/logos/text_logo.png";
import GoogleLogo from "../assets/logos/googleLogo.svg";
import GithubLogo from "../assets/logos/githubLogo.svg";

import EmailIcon from "../assets/icons/black/email.svg";
import LockIcon from "../assets/icons/black/lock.svg";

import InputForm from "../components/ui/input/InputForm";
import {
  validateEmailInput,
  validatePasswordInput,
} from "../utils/validate.jsx";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Email:", email);
    // console.log("Password: ", password);

    const validateEmail = validateEmailInput(email);
    const validatePassword = validatePasswordInput(password);

    if (!validateEmail.valid) {
      toast.error(validateEmail.message);
      return;
    }

    if (!validatePassword.valid) {
      toast.error(validatePassword.message);
      setPassword("");
      return;
    }
  };

  useEffect(() => {
    document.title = "Login";
  });

  return (
    <div className="bg-gray-100 center h-screen flex items-center justify-center">
      <div className="rounded-2xl shadow-md bg-white w-full mx-5 sm:mx-10 md:mx-40 lg:mx-60 xl:w-auto max-w-[1200px]">
        <div className="grid xl:grid-cols-2 gap-4 w-full h-auto">
          <div className="w-full h-full hidden xl:block">
            <img
              src={video_frame_login}
              alt=""
              className="h-full w-full aspect-square rounded-l-2xl"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-8 sm:p-10 lg:px-[60px] py-20 gap-3 bg-red-100//">
            <div className="flex flex-col w-full mb-6 items-start justify-center">
              <h1 className="text-3xl font-bold">Welcome to FB58</h1>
              <h2 className="tracking-wider text-gray-500 mt-2">
                Football pitch management system
              </h2>
            </div>
            <InputForm
              placeholder={"Email"}
              icon={EmailIcon}
              type={"email"}
              name={email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputForm
              placeholder={"Password"}
              icon={LockIcon}
              type={"password"}
              name={password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="cursor-pointer text-[14px] w-full text-right text-gray-500 hover:text-blue-600 active:scale-[.98] active:duration-75 transition-all">
              Forgot password?
            </p>
            <button
              onClick={handleSubmit}
              className="bg-black text-lg font-bold text-white w-full py-2 rounded-xl cursor-pointer hover:bg-black/50 active:scale-[.98] active:duration-75 transition-all"
            >
              Log in
            </button>
            <div className="flex items-center w-full my-2">
              <div className="flex-1 h-px bg-gray-400"></div>
              <p className="px-4 text-[14px] text-gray-500 whitespace-nowrap ">
                Or log in with
              </p>
              <div className="flex-1 h-px bg-gray-400"></div>
            </div>
            <div className="w-full flex gap-2">
              <button className="bg-white border-[1px] border-gray-200 w-full py-3 rounded-xl cursor-pointer hover:bg-gray-100 center gap-4 active:scale-[.98] active:duration-75 transition-all">
                <img className="w-6" src={GoogleLogo} alt="gmail.png" />
                Google
              </button>
              <button className="bg-white border-[1px] border-gray-200 w-full py-3 rounded-xl cursor-pointer hover:bg-gray-100 center gap-4 active:scale-[.98] active:duration-75 transition-all">
                <img className="w-6" src={GithubLogo} alt="github.png" />
                Github
              </button>
            </div>
            <div className="flex items-center justify-center mt-4 gap-1 w-full px-1">
              <p className="text-[14px] text-gray-800">
                Don't have an account ?
              </p>
              <button
                onClick={() => navigate("/signup")}
                className=" cursor-pointer ml-1 text-[14px] font-semibold text-black hover:underline active:scale-[.98] active:duration-75 transition-all"
              >
                {"Register one"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
