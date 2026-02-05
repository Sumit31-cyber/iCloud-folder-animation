import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Footer = ({ isOpen }: { isOpen: SharedValue<boolean> }) => {
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
        height: SCREEN_HEIGHT * 0.08,
        width: "100%",
        // backgroundColor: "#1e1e1e10",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
        justifyContent: "space-evenly",
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
