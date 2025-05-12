import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="flex flex-col md:flex-row gap-2 md:gap-16 w-full items-center justify-center py-10 tracking-wider text-sm md:text-md">
      <h1>© 2025 DOM, Corp</h1>
      <div className="flex gap-10 items-center justify-center">
        <button
          className="hover:text-green-700 hover:underline"
          onClick={() => navigate("/about")}
        >
          About us
        </button>
        <button
          className="hover:text-green-700 hover:underline"
          onClick={() => navigate("/privacy")}
        >
          Privacy
        </button>
        <button
          className="hover:text-green-700 hover:underline"
          onClick={() => navigate("/security")}
        >
          Security
        </button>
        <button
          className="hover:text-green-700 hover:underline"
          onClick={() => navigate("/docs")}
        >
          Docs
        </button>
        <button
          className="hover:text-green-700 hover:underline"
          onClick={() => navigate("/contribute")}
        >
          Contribute
        </button>
      </div>
    </footer>
  );
};

export default Footer;
