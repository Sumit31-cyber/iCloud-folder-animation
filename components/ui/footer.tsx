import { easing, HEADER_FOOTER_PADDING } from "@/constants/constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import React, { memo, useCallback } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Constants
const SPRING_CONFIG = {
  damping: 12,
  stiffness: 100,
  mass: 0.65,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

const TIMING_CONFIG = {
  duration: 400,
  easing: easing,
} as const;

const ANIMATION_VALUES = {
  BLUR_INTENSITY_OPEN: 40,
  BLUR_INTENSITY_CLOSED: 0,
  ADD_FOLDER_TRANSLATE_X: -80,
  MORE_OPTIONS_TRANSLATE_X_OPEN: -40,
  MORE_OPTIONS_TRANSLATE_X_CLOSED: 40,
  CENTER_TEXT_SCALE_OPEN: 1.2,
} as const;

const COLORS = {
  BACKGROUND: "#F5F5F5",
  ICON: "#000000",
  TEXT: "#000000",
} as const;

const SIZES = {
  FOLDER_ICON: 30,
  MORE_ICON: 30,
  EDIT_ICON: 28,
  HORIZONTAL_PADDING: 20,
  CENTER_TEXT_MARGIN: -40,
  BUTTON_GAP: 8,
  BLUR_TOP_OFFSET: -5,
  BLUR_BOTTOM_OFFSET: -20,
  BLUR_WIDTH: 200,
  BLUR_LEFT_OFFSET: -10,
} as const;

// Types
interface FooterProps {
  isOpen: SharedValue<boolean>;
  notesCount?: number;
  onAddFolderPress?: () => void;
  onMoreOptionsPress?: () => void;
  onEditPress?: () => void;
  backgroundColor?: string;
  iconColor?: string;
  textColor?: string;
  notesLabel?: string;
}

// Animated Components
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Footer = memo<FooterProps>(
  ({
    isOpen,
    notesCount = 0,
    onAddFolderPress,
    onMoreOptionsPress,
    onEditPress,
    backgroundColor = COLORS.BACKGROUND,
    iconColor = COLORS.ICON,
    textColor = COLORS.TEXT,
    notesLabel = "Notes",
  }) => {
    const { bottom } = useSafeAreaInsets();

    // Blur intensity animations
    const folderBlurIntensity = useSharedValue<number | undefined>(
      ANIMATION_VALUES.BLUR_INTENSITY_CLOSED
    );
    const notesCountBlurIntensity = useSharedValue<number | undefined>(
      ANIMATION_VALUES.BLUR_INTENSITY_CLOSED
    );

    // Sync blur animations with open state
    useDerivedValue(() => {
      if (isOpen.value) {
        folderBlurIntensity.value = withTiming(
          ANIMATION_VALUES.BLUR_INTENSITY_OPEN,
          TIMING_CONFIG
        );
        notesCountBlurIntensity.value = withTiming(
          ANIMATION_VALUES.BLUR_INTENSITY_CLOSED,
          TIMING_CONFIG
        );
      } else {
        folderBlurIntensity.value = withTiming(
          ANIMATION_VALUES.BLUR_INTENSITY_CLOSED,
          TIMING_CONFIG
        );
        notesCountBlurIntensity.value = withTiming(
          ANIMATION_VALUES.BLUR_INTENSITY_OPEN,
          TIMING_CONFIG
        );
      }
    }, [isOpen]);

    // Add folder button animation
    const addFolderAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming(!isOpen.value ? 1 : 0, TIMING_CONFIG),
        transform: [
          { scale: withSpring(!isOpen.value ? 1 : 0, SPRING_CONFIG) },
          {
            translateX: withSpring(
              !isOpen.value ? 0 : ANIMATION_VALUES.ADD_FOLDER_TRANSLATE_X,
              SPRING_CONFIG
            ),
          },
        ],
      }),
      [isOpen]
    );

    // More options button animation
    const moreOptionsAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming(isOpen.value ? 1 : 0, TIMING_CONFIG),
        transform: [
          { scale: withSpring(isOpen.value ? 1 : 0, SPRING_CONFIG) },
          {
            translateX: withSpring(
              isOpen.value
                ? ANIMATION_VALUES.MORE_OPTIONS_TRANSLATE_X_OPEN
                : ANIMATION_VALUES.MORE_OPTIONS_TRANSLATE_X_CLOSED,
              SPRING_CONFIG
            ),
          },
        ],
      }),
      [isOpen]
    );

    // Center text animation
    const centerTextAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming(isOpen.value ? 1 : 0, TIMING_CONFIG),
        transform: [
          {
            scale: withSpring(
              isOpen.value ? ANIMATION_VALUES.CENTER_TEXT_SCALE_OPEN : 0,
              SPRING_CONFIG
            ),
          },
        ],
      }),
      [isOpen]
    );

    // Memoized event handlers
    const handleAddFolderPress = useCallback(() => {
      onAddFolderPress?.();
    }, [onAddFolderPress]);

    const handleMoreOptionsPress = useCallback(() => {
      onMoreOptionsPress?.();
    }, [onMoreOptionsPress]);

    const handleEditPress = useCallback(() => {
      onEditPress?.();
    }, [onEditPress]);

    // Format notes count text
    const notesCountText = `${notesCount} ${notesLabel}`;

    return (
      <View
        style={[
          styles.container,
          { paddingBottom: bottom + HEADER_FOOTER_PADDING, backgroundColor },
        ]}
      >
        <View style={styles.leftContainer}>
          {/* Closed state - Add folder button */}
          <Animated.View style={addFolderAnimatedStyle}>
            <TouchableOpacity
              onPress={handleAddFolderPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Add folder"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={!onAddFolderPress}
            >
              <MaterialCommunityIcons
                name="folder-plus-outline"
                size={SIZES.FOLDER_ICON}
                color={iconColor}
              />
            </TouchableOpacity>
            <AnimatedBlurView
              pointerEvents="none"
              tint="extraLight"
              intensity={folderBlurIntensity}
              style={styles.blurOverlay}
            />
          </Animated.View>

          {/* Open state - More options button */}
          <Animated.View
            style={[moreOptionsAnimatedStyle, styles.moreOptionsContainer]}
          >
            <TouchableOpacity
              onPress={handleMoreOptionsPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="More options"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={!onMoreOptionsPress}
            >
              <MaterialCommunityIcons
                name="dots-horizontal-circle-outline"
                size={SIZES.MORE_ICON}
                color={iconColor}
              />
            </TouchableOpacity>
            <AnimatedBlurView
              pointerEvents="none"
              tint="extraLight"
              intensity={notesCountBlurIntensity}
              style={styles.blurOverlay}
            />
          </Animated.View>
        </View>

        {/* Center - Notes count */}
        <View style={styles.centerContainer}>
          <Animated.Text
            style={[
              styles.centerText,
              centerTextAnimatedStyle,
              { color: textColor },
            ]}
            numberOfLines={1}
            accessibilityLabel={`${notesCount} ${notesLabel}`}
          >
            {notesCountText}
          </Animated.Text>
          <AnimatedBlurView
            pointerEvents="none"
            tint="extraLight"
            intensity={notesCountBlurIntensity}
            style={styles.blurOverlay}
          />
        </View>

        {/* Right - Edit button */}
        <TouchableOpacity
          onPress={handleEditPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Edit"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={!onEditPress}
        >
          <MaterialCommunityIcons
            name="square-edit-outline"
            size={SIZES.EDIT_ICON}
            color={iconColor}
          />
        </TouchableOpacity>
      </View>
    );
  }
);

Footer.displayName = "Footer";

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: SIZES.HORIZONTAL_PADDING,
    justifyContent: "space-evenly",
    paddingTop: HEADER_FOOTER_PADDING,
    ...Platform.select({
      web: {
        userSelect: "none",
      } as ViewStyle,
    }),
  } as ViewStyle,
  leftContainer: {
    flexDirection: "row",
  } as ViewStyle,
  moreOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.BUTTON_GAP,
  } as ViewStyle,
  centerContainer: {
    marginLeft: SIZES.CENTER_TEXT_MARGIN,
  } as ViewStyle,
  centerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: SIZES.BLUR_TOP_OFFSET,
    bottom: SIZES.BLUR_BOTTOM_OFFSET,
    width: SIZES.BLUR_WIDTH,
    left: SIZES.BLUR_LEFT_OFFSET,
  } as ViewStyle,
});
