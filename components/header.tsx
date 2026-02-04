import { Feather } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Header = ({ isOpen }: { isOpen: SharedValue<boolean> }) => {
  const backButtonAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen.value ? 1 : 0),
      transform: [
        {
          scale: withTiming(isOpen.value ? 1 : 0),
        },
        {
          translateX: withTiming(isOpen.value ? -80 : 0),
        },
      ],
    };
  });
  const headerTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(!isOpen.value ? 1 : 0),
      transform: [
        {
          translateX: withTiming(!isOpen.value ? 0 : -140),
        },
      ],
    };
  });
  return (
    <View
      style={{
        flexDirection: "row",
        height: SCREEN_HEIGHT * 0.08,
        width: "100%",
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

export default Header;

const styles = StyleSheet.create({});
