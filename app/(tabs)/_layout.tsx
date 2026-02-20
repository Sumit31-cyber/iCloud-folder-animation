import { useAppTheme } from "@/hooks/useAppTheme";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const { colors } = useAppTheme();
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="first">
        <Label>List</Label>
        <Icon
          sf="rectangle.grid.1x2.fill"
          drawable="custom_settings_drawable"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="second">
        <Icon sf="square.grid.2x2.fill" drawable="custom_android_drawable" />

        <Label>Grid</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="third" role="search">
        <Icon sf="magnifyingglass" drawable="custom_settings_drawable" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
