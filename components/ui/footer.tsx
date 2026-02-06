import { HEADER_FOOTER_PADDING } from "@/constants/constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Footer = ({ isOpen }: { isOpen: SharedValue<boolean> }) => {
  const { bottom } = useSafeAreaInsets();

  const addFolderAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(!isOpen.value ? 1 : 0, {
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      transform: [
        {
          scale: withTiming(!isOpen.value ? 1 : 0, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
        {
          translateX: withTiming(!isOpen.value ? 0 : -80, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });

  const moreOptionAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen.value ? 1 : 0, {
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      transform: [
        {
          scale: withTiming(isOpen.value ? 1 : 0, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
        {
          translateX: withTiming(isOpen.value ? -40 : 40, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });
  const centerTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen.value ? 1 : 0),
      transform: [
        {
          scale: withTiming(isOpen.value ? 1.2 : 0),
        },
      ],
    };
  });

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
        justifyContent: "space-evenly",
        paddingBottom: bottom + HEADER_FOOTER_PADDING,
        paddingTop: HEADER_FOOTER_PADDING,
        backgroundColor: "#F5F5F5",
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Animated.View style={[addFolderAnimation]}>
          <MaterialCommunityIcons
            name="folder-plus-outline"
            size={30}
            color="black"
          />
        </Animated.View>

        <Animated.View
          style={[
            moreOptionAnimation,
            { flexDirection: "row", alignItems: "center", gap: 8 },
          ]}
        >
          <MaterialCommunityIcons
            name="dots-horizontal-circle-outline"
            size={30}
            color="black"
          />
        </Animated.View>
      </View>
      <View style={{ marginLeft: -40 }}>
        <Animated.Text style={centerTextStyle}>12 Notes</Animated.Text>
      </View>
      <MaterialCommunityIcons
        name="square-edit-outline"
        size={28}
        color="black"
      />
    </View>
  );
};

export default Footer;
