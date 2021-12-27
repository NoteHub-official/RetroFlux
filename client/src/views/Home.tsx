import React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import useTheme from "../hooks/useTheme";

const Home: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <button onClick={toggleTheme} className="btn-theme">
          {theme === "light" ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Home;
