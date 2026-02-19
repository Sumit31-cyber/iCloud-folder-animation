import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";

export const Colors = {
  light: {
    ...DefaultTheme.colors,
    backgroundColor: "#F5F5F5",
    textColor: "#000000",
    secondaryText: "#4a4a47",
    cardBackground: "#FFFFFF",
    notesColor: "#818080",
  },
  dark: {
    ...DarkTheme.colors,
    backgroundColor: "#151515",
    textColor: "#FFFFFF",
    secondaryText: "#74797c",
    cardBackground: "#1C1C1E",
    notesColor: "#dee2e6",
  },
};

type AppColors = {
  [K in keyof typeof Colors.light]: string;
};

export interface AppTheme extends Omit<Theme, "colors"> {
  colors: AppColors;
}

export const CustomLightTheme: AppTheme = {
  ...DefaultTheme,
  colors: Colors.light,
};

export const CustomDarkTheme: AppTheme = {
  ...DarkTheme,
  colors: Colors.dark,
};
