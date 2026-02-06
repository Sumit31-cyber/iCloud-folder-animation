import { Easing } from "react-native-reanimated";

export const HEADER_FOOTER_PADDING = 14;
export const easing = Easing.bezier(0.25, 0.1, 0.25, 1);

export function formattedDate(dateStr: string) {
  const formatted = new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  return formatted;
}
