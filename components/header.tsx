import { easing, HEADER_FOOTER_PADDING } from "@/constants/constants";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { ChevronLeft } from "lucide-react-native";
import React, { memo, useCallback } from "react";
import {
  Platform,
  StyleSheet,
  Text,
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
  duration: 600,
  easing: easing,
} as const;

const ANIMATION_VALUES = {
  BLUR_INTENSITY_OPEN: 40,
  BLUR_INTENSITY_CLOSED: 0,
  BACK_BUTTON_TRANSLATE_X: -80,
  HEADER_TITLE_TRANSLATE_X: -140,
} as const;

const COLORS = {
  BACKGROUND: "#F5F5F5",
  ICON: "#000000",
  TEXT: "#000000",
} as const;

const SIZES = {
  ICON: 26,
  TITLE_FONT: 26,
  HORIZONTAL_PADDING: 20,
  VERTICAL_PADDING: 10,
  TITLE_LETTER_SPACING: 0.9,
  SUBTITLE_LETTER_SPACING: 1,
  BLUR_TOP_OFFSET: -5,
  BLUR_BOTTOM_OFFSET: -20,
  BLUR_WIDTH: 200,
  BLUR_LEFT_OFFSET: -10,
  BUTTON_GAP: 8,
} as const;

// Types
interface HeaderProps {
  isOpen: SharedValue<boolean>;
  onBackButtonPress: () => void;
  onSearchPress?: () => void;
  backgroundColor?: string;
  iconColor?: string;
  title?: string;
  subtitle?: string;
}

// Animated Components
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Header = memo<HeaderProps>(
  ({
    isOpen,
    onBackButtonPress,
    onSearchPress,
    backgroundColor = COLORS.BACKGROUND,
    iconColor = COLORS.ICON,
    title = "Folders",
    subtitle = "All iCloud",
  }) => {
    const { top } = useSafeAreaInsets();

    // Blur intensity animations
    const folderBlurIntensity = useSharedValue<number | undefined>(
      ANIMATION_VALUES.BLUR_INTENSITY_CLOSED
    );
    const backButtonBlurIntensity = useSharedValue<number | undefined>(
      ANIMATION_VALUES.BLUR_INTENSITY_CLOSED
    );

    // Sync blur animations with open state
    useDerivedValue(() => {
      if (isOpen.value) {
        folderBlurIntensity.value = withTiming(
          ANIMATION_VALUES.BLUR_INTENSITY_OPEN,
          TIMING_CONFIG
        );
        backButtonBlurIntensity.value = withTiming(
          ANIMATION_VALUES.BLUR_INTENSITY_CLOSED,
          TIMING_CONFIG
        );
      } else {
        folderBlurIntensity.value = withTiming(
          ANIMATION_VALUES.BLUR_INTENSITY_CLOSED,
          TIMING_CONFIG
        );
        backButtonBlurIntensity.value = withTiming(
          ANIMATION_VALUES.BLUR_INTENSITY_OPEN,
          TIMING_CONFIG
        );
      }
    }, [isOpen]);

    // Back button animation
    const backButtonAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming(isOpen.value ? 1 : 0, TIMING_CONFIG),
        transform: [
          { scale: withSpring(isOpen.value ? 1 : 0, SPRING_CONFIG) },
          {
            translateX: withSpring(
              isOpen.value ? ANIMATION_VALUES.BACK_BUTTON_TRANSLATE_X : 0,
              SPRING_CONFIG
            ),
          },
        ],
      }),
      [isOpen]
    );

    // Header title animation
    const headerTitleAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming(!isOpen.value ? 1 : 0, TIMING_CONFIG),
        transform: [
          { scale: withSpring(!isOpen.value ? 1 : 0, SPRING_CONFIG) },
          {
            translateX: withSpring(
              !isOpen.value ? 0 : ANIMATION_VALUES.HEADER_TITLE_TRANSLATE_X,
              SPRING_CONFIG
            ),
          },
        ],
      }),
      [isOpen]
    );

    // Memoized search press handler
    const handleSearchPress = useCallback(() => {
      onSearchPress?.();
    }, [onSearchPress]);

    // Memoized back button press handler
    const handleBackPress = useCallback(() => {
      onBackButtonPress();
    }, [onBackButtonPress]);

    return (
      <View
        style={[
          styles.container,
          { paddingTop: top + HEADER_FOOTER_PADDING, backgroundColor },
        ]}
      >
        <View style={styles.titleContainer}>
          {/* Closed state - Folder title */}
          <Animated.View style={headerTitleAnimatedStyle}>
            <Text
              style={[styles.title, { color: iconColor }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <AnimatedBlurView
              pointerEvents="none"
              tint="extraLight"
              intensity={folderBlurIntensity}
              style={styles.blurOverlay}
            />
          </Animated.View>

          {/* Open state - Back button and subtitle */}
          <Animated.View
            style={[backButtonAnimatedStyle, styles.backButtonContainer]}
          >
            <TouchableOpacity
              onPress={handleBackPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={SIZES.ICON} color={iconColor} />
              {/* <Feather name="arrow-left" size={SIZES.ICON} color={iconColor} /> */}
            </TouchableOpacity>
            <Text
              style={[styles.subtitle, { color: iconColor }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
            <AnimatedBlurView
              pointerEvents="none"
              tint="extraLight"
              intensity={backButtonBlurIntensity}
              style={styles.blurOverlay}
            />
          </Animated.View>
        </View>

        {/* Search button */}
        <TouchableOpacity
          onPress={handleSearchPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Search"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={!onSearchPress}
        >
          <Feather name="search" size={SIZES.ICON} color={iconColor} />
        </TouchableOpacity>
      </View>
    );
  }
);

Header.displayName = "Header";

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: SIZES.HORIZONTAL_PADDING,
    marginBottom: SIZES.VERTICAL_PADDING,
    justifyContent: "space-between",
    paddingBottom: HEADER_FOOTER_PADDING,
    zIndex: 1,
    ...Platform.select({
      web: {
        userSelect: "none",
      } as ViewStyle,
    }),
  } as ViewStyle,
  titleContainer: {
    flexDirection: "row",
  } as ViewStyle,
  title: {
    fontSize: SIZES.TITLE_FONT,
    fontFamily: "bold",
    letterSpacing: SIZES.TITLE_LETTER_SPACING,
  },
  subtitle: {
    fontSize: SIZES.TITLE_FONT,
    fontFamily: "bold",
    letterSpacing: SIZES.SUBTITLE_LETTER_SPACING,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.BUTTON_GAP,
    left: -SIZES.BUTTON_GAP,
  } as ViewStyle,
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: SIZES.BLUR_TOP_OFFSET,
    bottom: SIZES.BLUR_BOTTOM_OFFSET,
    width: SIZES.BLUR_WIDTH,
    left: SIZES.BLUR_LEFT_OFFSET,
  } as ViewStyle,
});
