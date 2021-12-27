import React, { useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import useTheme from "../hooks/useTheme";

const Home: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <button
          onClick={toggleTheme}
          className="bg-gray-500 p-2 m-4 outline-none rounded-md text-white cursor-pointer
          hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:ring-offset-gray-50 transition
           dark:ring-offset-zinc-600 dark:hover:bg-gray-400"
        >
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
