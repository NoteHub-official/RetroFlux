import React from "react";
import { MoonIcon, SunIcon, MailIcon } from "@heroicons/react/solid";
import { Button } from "../components/Button";
import useTheme from "../hooks/useTheme";

const Components: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <div>
      <nav
        className="fixed bg-white h-[4.75rem] w-full border-b-[1px]
        flex justify-between items-center px-4 color-nav color-divider z-10"
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
        <div>
          <h2 className="font-medium my-4">Button</h2>
          <div className="flex justify-center items-center space-x-8">
            <Button className="btn-primary-outline">
              <MailIcon className="w-6 h-6 mr-2 mt-[2px]" />
              Click Me
            </Button>
            <Button className="btn-primary-filled">
              <MailIcon className="w-6 h-6 mr-2 mt-[2px]" />
              Click Me
            </Button>
            <Button className="btn-primary-inverted">
              <MailIcon className="w-6 h-6 mr-2 mt-[2px]" />
              Click Me
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Components;
