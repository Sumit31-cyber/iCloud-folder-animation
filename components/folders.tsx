import { GradientColors, NotesFolder } from "@/constants/docsData";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ellipsis } from "lucide-react-native";
import React, { memo } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import Docs from "./docs";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const _animationDuration = 800;

const SPRING_CONFIG = {
  damping: 28,
  stiffness: 65,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const STACK_OFFSET = 600;

type FolderProps = {
  height?: number;
  width?: number;
  item: NotesFolder;
  notchHeight?: number;
  borderRadius?: number;
  gradientColor: GradientColors;
  onPress: () => void;
  openedFolderIndex: SharedValue<number>;
  index: number;
};

const Folder = ({
  height = 100,
  width = 180,
  notchHeight = 22,
  borderRadius = 18,
  item,
  gradientColor,
  onPress,
  openedFolderIndex,
  index,
}: FolderProps) => {
  const transformationStyle = useAnimatedStyle(() => {
    const translateY =
      openedFolderIndex.value !== -1
        ? index < openedFolderIndex.value
          ? -(STACK_OFFSET * (index + 1))
          : SCREEN_HEIGHT
        : 0;

    return {
      transform: [{ translateY: withSpring(translateY, SPRING_CONFIG) }],
    };
  }, [openedFolderIndex]);

  const topLayerAnimatedStyle = useAnimatedStyle(() => {
    const isActive = openedFolderIndex.value === index;

    return {
      transform: [
        {
          perspective: -150,
        },
        // 🔥 depth animation
        {
          scale: withDelay(300, withSpring(isActive ? 1.1 : 1, SPRING_CONFIG)),
        },
        {
          rotateX: withDelay(
            300,
            withSpring(isActive ? "8deg" : "0deg", SPRING_CONFIG),
          ),
        },
      ],
    };
  }, [openedFolderIndex]);

  const docsTransformationStyle = useAnimatedStyle(() => {
    const translateY =
      openedFolderIndex.value !== -1
        ? index === openedFolderIndex.value
          ? 0
          : index < openedFolderIndex.value
            ? -(STACK_OFFSET * (index + 1))
            : SCREEN_HEIGHT
        : 0;

    return {
      transform: [{ translateY: withSpring(translateY, SPRING_CONFIG) }],
    };
  }, [openedFolderIndex]);

  return (
    <Pressable
      onPress={() => {
        if (openedFolderIndex.value === -1) onPress();
      }}
    >
      {/* Folder Backdrop */}
      <Animated.View
        style={[
          transformationStyle,
          styles.folderBase,
          { height, width, borderRadius },
        ]}
      >
        {/* Left Section */}
        <View
          style={[styles.leftBackdrop, { backgroundColor: gradientColor[0] }]}
        />

        {/* Right Section */}
        <View style={styles.rightBackdrop}>
          <View
            style={[
              styles.rightInnerStrip,
              { backgroundColor: gradientColor[0] },
            ]}
          />
          <View
            style={[
              styles.rightBottom,
              {
                height: height - notchHeight,
                backgroundColor: gradientColor[0],
                borderTopRightRadius: borderRadius,
              },
            ]}
          />
          <View style={[styles.notch, { height: notchHeight }]} />
        </View>
      </Animated.View>

      {/* Docs */}
      <Animated.View
        style={[
          docsTransformationStyle,
          styles.docsWrapper,
          { height: height - notchHeight, width },
        ]}
      >
        <Docs
          currentFolderIndex={index}
          activeFolderIndex={openedFolderIndex}
          docsData={item.notes}
        />
      </Animated.View>

      {/* Blurred Top Layer */}
      <Animated.View
        style={[
          transformationStyle,
          styles.topLayer,
          {
            height,
            width,
            shadowColor: "#111111",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
        ]}
      >
        <Animated.View
          style={[
            topLayerAnimatedStyle,
            styles.blurContainer,
            {
              borderColor: `${String(gradientColor[1])}10`,
              borderRadius: borderRadius,
              overflow: "hidden",
            },
          ]}
        >
          <BlurView
            intensity={18}
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: borderRadius,
              },
            ]}
          />
          <LinearGradient
            colors={gradientColor}
            style={[
              styles.gradient,

              {
                borderRadius: borderRadius,
              },
            ]}
          />

          <View style={[styles.content, { borderRadius: borderRadius }]}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Ellipsis size={18} color="white" opacity={0.9} />
            </View>
            <Text style={styles.count}>{item.totalNotes}</Text>
            <View
              style={{
                position: "absolute",
                bottom: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: width,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={[
                  {
                    color: "white",
                    fontFamily: "regular",
                    opacity: 0.7,
                    fontSize: 12,
                  },
                ]}
              >
                Last added time Feb 14, 2026
              </Text>
              <Image
                style={{ height: 20, width: 20, opacity: 0.9 }}
                source={require("@/assets/images/settings.png")}
              />
              {/* <Ionicons
                name="settings-sharp"
                size={18}
                color="rgba(252,252,252,0.9)"
              /> */}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default memo(Folder);

const styles = StyleSheet.create({
  folderBase: {
    flexDirection: "row",
    overflow: "hidden",
  },

  leftBackdrop: {
    position: "absolute",
    left: 0,
    width: "40%",
    height: "100%",
    borderTopRightRadius: 12,
  },

  rightBackdrop: {
    position: "absolute",
    right: 0,
    width: "60%",
    height: "100%",
  },

  rightInnerStrip: {
    position: "absolute",
    width: "40%",
    height: "100%",
    top: 1,
  },

  rightBottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  notch: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 15,
  },

  docsWrapper: {
    position: "absolute",
    bottom: 0,
  },

  topLayer: {
    position: "absolute",
  },

  blurContainer: {
    position: "absolute",
    bottom: 0,
    height: "60%",
    width: "100%",
    zIndex: 100,
  },

  gradient: {
    flex: 1,
    opacity: 0.5,
  },

  content: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderColor: "rgba(252,252,252,0.1)",
    padding: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 24,
    color: "white",
    fontFamily: "bold",
  },

  count: {
    fontSize: 22,
    color: "white",
    fontFamily: "regular",
    top: -4,
    opacity: 0.9,
  },
});
