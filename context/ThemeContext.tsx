import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

// @ts-ignore
const ThemeContext = createContext();

export const ThemeProvider = ({ children }: any) => {
  const systemTheme = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState("system");

  useEffect(() => {
    (async () => {
      if (!(await AsyncStorage.getItem("selected_theme"))) {
        await AsyncStorage.setItem("selected_theme", "system");
      }

      const savedTheme = await AsyncStorage.getItem("selected_theme");
      // @ts-ignore
      setSelectedTheme(savedTheme);
    })();
  }, []);

  const changeTheme = async (theme: string) => {
    setSelectedTheme(theme);
    await AsyncStorage.setItem("selected_theme", theme);
  };

  const currentTheme = selectedTheme === "system" ? systemTheme : selectedTheme;

  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        changeTheme,
        currentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
