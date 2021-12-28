import React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import useTheme from "../hooks/useTheme";

const Components: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <div>
      <nav
        className="fixed bg-white h-[4.75rem] w-full border-b-[1px]
        flex justify-between items-center px-4 color-nav color-divider"
      >
        <h1 className="text-2xl font-medium italic">Component Reference</h1>
        <button onClick={toggleTheme} className="btn-theme">
          {theme === "light" ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>
      </nav>
      <nav className="h-[4.75rem]"></nav>
      <div className="container mx-auto px-4 max-w-6xl h-screen prose prose-lg">
        <h2 className="font-medium my-4">Button</h2>
        <div className="flex justify-center items-center">
          <button className="btn btn-primary-outline">click me</button>
        </div>
      </div>
    </div>
  );
};

export default Components;
