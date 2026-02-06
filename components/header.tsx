import { easing, HEADER_FOOTER_PADDING } from "@/constants/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Header = ({
  isOpen,
  onBackButtonPress,
}: {
  isOpen: SharedValue<boolean>;
  onBackButtonPress: () => void;
}) => {
  const { top } = useSafeAreaInsets();
  const backButtonAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen.value ? 1 : 0),
      transform: [
        {
          scale: withTiming(isOpen.value ? 1 : 0, {
            easing: easing,
          }),
        },
        {
          translateX: withTiming(isOpen.value ? -80 : 0, {
            easing: easing,
          }),
        },
      ],
    };
  });
  const headerTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(!isOpen.value ? 1 : 0, {
        easing: easing,
      }),
      transform: [
        {
          scale: withTiming(!isOpen.value ? 1 : 0, {
            easing: easing,
          }),
        },
        {
          translateX: withTiming(!isOpen.value ? 0 : -140, {
            easing: easing,
          }),
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
        marginBottom: 10,
        justifyContent: "space-between",
        paddingTop: top + HEADER_FOOTER_PADDING,
        paddingBottom: HEADER_FOOTER_PADDING,
        zIndex: 1,
        backgroundColor: "#F5F5F5",
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
          <TouchableOpacity onPress={onBackButtonPress}>
            <Feather name="arrow-left" size={26} color="black" />
          </TouchableOpacity>
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
