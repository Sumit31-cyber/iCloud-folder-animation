import { GradientColors, NotesFolder } from "@/constants/docsData";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Docs from "./docs";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
export const _animationDuration = 800;
const Folder = ({
  height = 100,
  width = 180,
  item,
  notchHeight = 22,
  borderRadius = 18,
  gradientColor,
  onPress,
  openedFolderIndex,
  index,
}: {
  height?: number;
  width?: number;
  item: NotesFolder;
  notchHeight?: number;
  borderRadius?: number;
  gradientColor: GradientColors;
  onPress: () => void;
  openedFolderIndex: SharedValue<number>;
  index: number;
}) => {
  const transformationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            openedFolderIndex.value !== -1
              ? index < openedFolderIndex.value
                ? -(600 * (index + 1))
                : SCREEN_HEIGHT
              : 0,
            {
              duration: _animationDuration,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }
          ),
        },
      ],
    };
  }, [openedFolderIndex]);
  const docsTransformationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            openedFolderIndex.value !== -1
              ? index === openedFolderIndex.value
                ? 0
                : index < openedFolderIndex.value
                ? -(600 * (index + 1))
                : SCREEN_HEIGHT
              : 0,
            {
              duration: _animationDuration,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }
          ),
        },
      ],
    };
  }, [openedFolderIndex]);

  return (
    <Pressable
      onPress={() => {
        if (openedFolderIndex.value === -1) onPress();
      }}
    >
      <Animated.View
        style={[
          transformationStyle,
          {
            height: height,
            width: width,
            flexDirection: "row",
            borderRadius: borderRadius,
            overflow: "hidden",
          },
        ]}
      >
        {/* First Half of backdrop */}
        <View
          style={{
            height: "100%",
            width: "40%",
            backgroundColor: gradientColor[0],
            position: "absolute",
            left: 0,
            borderTopRightRadius: 12,
          }}
        ></View>

        {/* Second Half of backdrop */}
        <View
          style={{
            height: "100%",
            width: "60%",
            position: "absolute",
            right: 0,
          }}
        >
          <View
            style={{
              position: "absolute",
              height: "100%",
              width: "40%",
              backgroundColor: gradientColor[0],
            }}
          ></View>
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: height - notchHeight,
              bottom: 0,
              backgroundColor: gradientColor[0],
              borderTopRightRadius: borderRadius,
            }}
          ></View>
          <View
            style={{
              position: "absolute",
              height: notchHeight,
              width: "100%",
              backgroundColor: "#F5F5F5",
              right: 0,
              borderBottomLeftRadius: 15,
            }}
          ></View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          docsTransformationStyle,
          {
            position: "absolute",
            height: height - notchHeight,
            width: width,
            bottom: 0,
          },
        ]}
      >
        <Docs
          currentFolderIndex={index}
          activeFolderIndex={openedFolderIndex}
          docsData={item.notes}
        />
      </Animated.View>

      {/* Blurred Folder Top Layer */}
      <Animated.View
        style={[transformationStyle, { position: "absolute", height, width }]}
      >
        <View
          style={{
            position: "absolute",
            height: "60%",
            width: "100%",
            bottom: 0,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
            borderWidth: StyleSheet.hairlineWidth * 2,
            borderColor: `${String(gradientColor[1])}10`,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          <BlurView intensity={20} style={[StyleSheet.absoluteFill]}></BlurView>
          <LinearGradient
            colors={gradientColor}
            style={{
              flex: 1,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
              opacity: 0.4,
            }}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default Folder;
