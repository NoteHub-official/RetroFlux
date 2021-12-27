import { useState, useEffect } from "react";

type Theme = "light" | "dark";

const storageKey = "notehub-theme";
const initialTheme: Theme = localStorage.getItem(storageKey) ? "dark" : "light";
const root = document.getElementById("root");

/**
 * Hooks that returns the current theme and a function to set the theme
 * between light and dark.
 * @returns [theme: Theme, toggleTheme: () => void]
 */
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    if (initialTheme === "dark" && root && !root.classList.contains("dark")) {
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = (): void => {
    const currentTheme = theme;

    if (root) {
      if (currentTheme === "dark") {
        root.classList.remove("dark");
        localStorage.removeItem(storageKey);
      } else {
        root.classList.add("dark");
        localStorage.setItem(storageKey, "dark");
      }
    }
    setTheme(theme === "light" ? "dark" : "light");
  };

  return [theme, toggleTheme] as const;
};

export default useTheme;
