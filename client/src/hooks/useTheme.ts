import { useState, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
type Theme = "light" | "dark";

const storageKey = "chakra-ui-color-mode";
const initialTheme: Theme = (localStorage.getItem(storageKey) as Theme) || "light";
const root = document.getElementById("root");

/**
 * Hooks that returns the current theme and a function to set the theme
 * between light and dark.
 * @returns [theme: Theme, toggleTheme: () => void]
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (initialTheme === "dark" && root && !root.classList.contains("dark")) {
      root.classList.add("dark");
      if (colorMode === "light") {
        toggleColorMode();
      }
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
    toggleColorMode();
    setTheme(theme === "light" ? "dark" : "light");
  };

  return [theme, toggleTheme] as const;
};
