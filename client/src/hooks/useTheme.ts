import { useState } from "react";

type Theme = "light" | "dark";

const storageKey = "notehub-theme";
const initialTheme: Theme = localStorage.getItem(storageKey) ? "dark" : "light";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = (): void => {
    const currentTheme = theme;
    const root = document.getElementById("root");

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
