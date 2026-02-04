import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const keyframe = new Keyframe({
//   0: {
//     transform: [{ translateX: 0 }],
//   },
//   100: {
//     transform: [{ translateX: -150 }],
//   },
// });
const Footer = () => {
  const isOpen = useSharedValue(0);
  const [open, setOpen] = useState(false);

  const backButtonAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(open ? 1 : 0),
      transform: [
        {
          scale: withTiming(open ? 1 : 0),
        },
        {
          translateX: withTiming(open ? -80 : 0),
        },
      ],
    };
  });
  const headerTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(!open ? 1 : 0),
      transform: [
        {
          translateX: withTiming(!open ? 0 : -140),
        },
      ],
    };
  });
  return (
    <View
      onTouchEnd={() => {
        setOpen(!open);
      }}
      style={{
        flexDirection: "row",
        height: SCREEN_HEIGHT * 0.08,
        width: "100%",
        // backgroundColor: "#1e1e1e10",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Animated.View style={[headerTitleStyle]}>
          <Text
            style={{ fontSize: 26, fontFamily: "medium", letterSpacing: 0.9 }}
          >
            Folders
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            backButtonAnimation,
            { flexDirection: "row", alignItems: "center", gap: 8 },
          ]}
        >
          <Feather name="arrow-left" size={26} color="black" />
          <Text
            style={{ fontSize: 26, fontFamily: "medium", letterSpacing: 1 }}
          >
            All iCloud
          </Text>
        </Animated.View>
      </View>
      <Feather name="search" size={26} color="black" />
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({});
