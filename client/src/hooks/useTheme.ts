import { useColorMode } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";

export type Theme = "light" | "dark";

const root = document.getElementById("root");

/**
 * Hooks that returns the current theme and a function to set the theme
 * between light and dark.
 * @returns [theme: Theme, toggleTheme: () => void]
 */
const useTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [theme, setTheme] = useState<Theme>(colorMode);

  useEffect(() => {
    if (colorMode === "dark" && root && !root.classList.contains("dark")) {
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = (): void => {
    const currentTheme = theme;

    if (root) {
      if (currentTheme === "dark") {
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
      }
    }
    setTheme(theme === "light" ? "dark" : "light");
    toggleColorMode();
  };

  return [theme, toggleTheme] as const;
};

export default useTheme;
