import {
  AppTheme,
  CustomDarkTheme,
  CustomLightTheme,
} from "@/constants/customTheme";
import { useColorScheme } from "react-native";

export function useAppTheme() {
  const colorScheme = useColorScheme();

  const theme: AppTheme =
    colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme;

  return {
    theme,
    colors: theme.colors,
  };
}
