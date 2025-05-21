// ./client/src/components/auth/SignUpForm.jsx

import googleLogo from "../../../assets/logos/googleLogo.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";
import { authWithGoogle } from "../../../services/firebase-config.jsx";

const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { configUser } = useAuthContext();
  const navigate = useNavigate();

  const VITE_BASE_URL = import.meta.env.VITE_REMOTE_API_SERVER;

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      toast.error("Please fill in your full name");
      return;
    }

    if (!email) {
      toast.error("Please fill in your email address");
      return;
    }

    if (!password) {
      toast.error("Please fill in your password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${VITE_BASE_URL}/api/auth/signup`, {
        full_name: fullName,
        email,
        password,
        navigateToHome: true,
      });
      console.log(response);
      
      const user = response.data.data.user;
      const access_token = response.data.data.user.access_token;

      toast.success("Registration successful!");
      configUser(user, access_token);
      navigate("/");
    } catch (error) {
      // toast.error(
      //   !error.response.data.error
      //     ? "Failed to sign up"
      //     : error.response.data.error
      // );

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authWithGoogle();
      if (!user) {
        toast.error("No user returned from Google sign-in");
        return;
      }

      const oauthData = {
        fullName: user.displayName,
        email: user.email,
        profile_img: user.photoURL,
      };

      const { data } = await axios.post(
        `${VITE_BASE_URL}/api/auth/oauth`,
        oauthData
      );

      configUser(data);
      toast.success("Google sign-in successful");
      navigate("/", { replace: true });
    } catch (error) {
      if (error.request?.response) {
        try {
          const errorData = JSON.parse(error.request.response);
          toast.error(errorData.message || "Google sign-in failed");
        } catch {
          toast.error("Google sign-in failed");
        }
      } else {
        toast.error("Google sign-in failed");
      }
      console.error("Google auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto px-2 sm:px-6">
      <h1 className="font-bold text-2xl sm:text-4xl">athStock</h1>
      <h2 className="tracking-wide text-md text-gray-500">
        To continue, sign up for an account.
      </h2>

      <div className="mt-6">
        <form className="flex flex-col" onSubmit={handleSignUp}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              className={`w-full tracking-wide bg-gray-100 py-3 px-4 text-sm rounded-lg outline-none 
                border ${fullName ? "" : "border-red-500"}`}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className={`w-full tracking-wide bg-gray-100 py-3 px-4 text-sm rounded-lg outline-none 
                border ${email ? "" : "border-red-500"}`}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              className={`w-full tracking-wide bg-gray-100 py-3 px-4 text-sm rounded-lg outline-none 
                border ${password ? "" : "border-red-500"}`}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`py-3 rounded-xl bg-black text-sm text-white font-semibold tracking-wide
              hover:bg-black/80 active:scale-[.98] active:duration-75 transition-all
              ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-200" />
          <span className="px-4 text-sm text-gray-500">Or sign up with</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        <button
          className="w-full flex items-center justify-center py-3 rounded-xl bg-gray-100 text-black 
            hover:bg-gray-200 active:scale-[.98] active:duration-75 transition-all disabled:opacity-70"
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
          <span className="ml-3 text-sm">
            {isLoading ? "Processing..." : "Sign up with Google"}
          </span>
        </button>

        <div className="flex items-center justify-center mt-6">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            disabled={isLoading}
            className="ml-1 text-xs font-semibold text-black hover:underline active:scale-[.98] active:duration-75 transition-all"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
