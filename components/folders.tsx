import { GradientColors, NotesFolder } from "@/constants/docsData";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ellipsis } from "lucide-react-native";
import React, { memo } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
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
        style={[transformationStyle, styles.topLayer, { height, width }]}
      >
        <View
          style={[
            styles.blurContainer,
            {
              borderColor: `${String(gradientColor[1])}10`,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
            },
          ]}
        >
          <BlurView intensity={18} style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={gradientColor}
            style={[
              styles.gradient,
              {
                borderBottomLeftRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
              },
            ]}
          />

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Ellipsis size={26} color="white" opacity={0.9} />
            </View>
            <Text style={styles.count}>{item.totalNotes}</Text>
          </View>
        </View>
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
    borderWidth: StyleSheet.hairlineWidth * 2,
    overflow: "hidden",
    zIndex: 100,
  },

  gradient: {
    flex: 1,
    opacity: 0.5,
  },

  content: {
    ...StyleSheet.absoluteFillObject,
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
    fontSize: 24,
    color: "white",
    fontFamily: "regular",
    top: -4,
    opacity: 0.9,
  },
});
