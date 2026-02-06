import { easing, formattedDate } from "@/constants/constants";
import { chunkArray, Note } from "@/constants/docsData";
import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { _animationDuration } from "./folders";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ROW_SIZE = 2;

const CARD_WIDTH = 80;
const CARD_HEIGHT = 100;

const EXP_CARD_HEIGHT = CARD_HEIGHT * 2;

const GAP = 20;

const PLACEHOLDER_WIDTHS = ["100%", "40%", "70%"] as const;
const PLACEHOLDER_COUNT = 3;

// Three different card style variations for different folders
const CARD_STYLES_VARIATION_1 = [
  {
    rotation: "-18deg",
    translateX: 6,
    translateY: 0,
    zIndex: 3,
  },
  {
    rotation: "-6deg",
    translateX: 0,
    translateY: 6,
    zIndex: 2,
  },
  {
    rotation: "10deg",
    translateX: -6,
    translateY: 12,
    zIndex: 1,
  },
] as const;

const CARD_STYLES_VARIATION_2 = [
  {
    rotation: "-15deg",
    translateX: 0,
    translateY: 10,
    zIndex: 3,
  },
  {
    rotation: "0deg",
    translateX: 0,
    translateY: -5,
    zIndex: 2,
  },
  {
    rotation: "15deg",
    translateX: 0,
    translateY: 14,
    zIndex: 1,
  },
] as const;

const CARD_STYLES_VARIATION_3 = [
  {
    rotation: "-20deg",
    translateX: 10,
    translateY: -10,
    zIndex: 3,
  },
  {
    rotation: "8deg",
    translateX: -10,
    translateY: -10,
    zIndex: 2,
  },
  {
    rotation: "10deg",
    translateX: -20,
    translateY: -10,
    zIndex: 1,
  },
] as const;

// Array to hold all variations
const CARD_STYLES_VARIATIONS = [
  CARD_STYLES_VARIATION_1,
  CARD_STYLES_VARIATION_2,
  CARD_STYLES_VARIATION_3,
] as const;

const springConfig = {
  damping: 28,
  stiffness: 65,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const timingConfig = {
  duration: _animationDuration,
  easing: easing,
};

interface PlaceholderProps {
  width: string;
}

const Placeholder: React.FC<PlaceholderProps> = memo(({ width }) => (
  <View style={[styles.placeholder, { width: width as any }]} />
));

Placeholder.displayName = "Placeholder";

interface DocumentCardProps {
  currentFolderIndex: number;
  activeFolderIndex: SharedValue<number>;
  docIndex: number;
  docData: Note;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const DocumentCard: React.FC<DocumentCardProps> = memo(
  ({ currentFolderIndex, activeFolderIndex, docIndex, docData }) => {
    const folderBlurIntensity = useSharedValue<number | undefined>(40);

    useDerivedValue(() => {
      if (activeFolderIndex.value !== -1) {
        folderBlurIntensity.value = withTiming(0, { duration: 1200 });
      } else {
        folderBlurIntensity.value = withTiming(40, { duration: 1200 });
      }
    }, [activeFolderIndex]);

    const placeholders = useMemo(
      () =>
        Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => ({
          id: index,
          width: PLACEHOLDER_WIDTHS[index],
        })),
      []
    );

    // const rDocStyle = useAnimatedStyle(() => {
    //   const isActive = currentFolderIndex === activeFolderIndex.value;
    //   const currentIndex = docData.id;

    //   // Select card style variation based on folder index
    //   const styleVariation = CARD_STYLES_VARIATIONS[currentFolderIndex % 3];
    //   const stackStyle = styleVariation[Math.min(docIndex, 2)];

    //   const baseYOffset = -(currentFolderIndex * 200 + GAP * 2);

    //   // 🧠 dynamic row calculation
    //   const rowIndex = Math.floor(currentIndex / ROW_SIZE);

    //   const expandedTranslateY =
    //     rowIndex >= 0 ? baseYOffset + rowIndex * (EXP_CARD_HEIGHT + GAP) : 0;

    //   const collapsedLeft = docIndex === 0 ? 60 : 60 + 80 * docIndex;

    //   const expandedCardWidth = SCREEN_WIDTH * 0.5 - GAP * 2;

    //   const expandedLeft =
    //     currentIndex % ROW_SIZE === 0 ? -5 : expandedCardWidth + GAP + 5;

    //   return {
    //     height: withSpring(
    //       isActive ? EXP_CARD_HEIGHT : CARD_HEIGHT,
    //       springConfig
    //     ),

    //     width: withSpring(
    //       isActive ? (SCREEN_WIDTH - GAP * 3) * 0.5 : CARD_WIDTH,
    //       springConfig
    //     ),

    //     opacity: withTiming(
    //       isActive || currentIndex <= 2 ? 1 : 0.8,
    //       timingConfig
    //     ),

    //     borderRadius: withSpring(isActive ? 20 : 6, springConfig),

    //     left: withSpring(isActive ? expandedLeft : collapsedLeft, springConfig),

    //     transform: [
    //       {
    //         rotate: withSpring(
    //           isActive ? "0deg" : stackStyle.rotation,
    //           springConfig
    //         ),
    //       },
    //       {
    //         translateY: withSpring(
    //           isActive ? expandedTranslateY - GAP * 1.5 : stackStyle.translateY,
    //           springConfig
    //         ),
    //       },
    //     ],
    //   };
    // });

    const rDocStyle = useAnimatedStyle(() => {
      const isActive = currentFolderIndex === activeFolderIndex.value;
      const currentIndex = docData.id;

      // Select card style variation based on folder index
      const styleVariation = CARD_STYLES_VARIATIONS[currentFolderIndex % 3];
      const stackStyle = styleVariation[Math.min(docIndex, 2)];

      const baseYOffset = -(currentFolderIndex * 200 + GAP * 2);

      // 🧠 dynamic row calculation
      const rowIndex = Math.floor(currentIndex / ROW_SIZE);

      const expandedTranslateY =
        rowIndex >= 0 ? baseYOffset + rowIndex * (EXP_CARD_HEIGHT + GAP) : 0;

      const collapsedLeft = docIndex === 0 ? 60 : 60 + 80 * docIndex;

      const expandedCardWidth = SCREEN_WIDTH * 0.5 - GAP * 2;

      const expandedLeft =
        currentIndex % ROW_SIZE === 0 ? -5 : expandedCardWidth + GAP + 5;

      return {
        height: withSpring(
          isActive ? EXP_CARD_HEIGHT : CARD_HEIGHT,
          springConfig
        ),

        width: withSpring(
          isActive ? (SCREEN_WIDTH - GAP * 3) * 0.5 : CARD_WIDTH,
          springConfig
        ),

        borderRadius: withSpring(isActive ? 20 : 6, springConfig),

        left: withSpring(isActive ? expandedLeft : collapsedLeft, springConfig),

        transform: [
          {
            rotate: withSpring(
              isActive ? "0deg" : stackStyle.rotation,
              springConfig
            ),
          },
          {
            translateX: withSpring(
              isActive ? 0 : stackStyle.translateX,
              springConfig
            ),
          },
          {
            translateY: withSpring(
              isActive ? expandedTranslateY - GAP * 1.5 : stackStyle.translateY,
              springConfig
            ),
          },
        ],
      };
    });
    const animatedContentStyle = useAnimatedStyle(() => {
      const isContentVisible = activeFolderIndex.value !== -1;

      return {
        opacity: withDelay(
          activeFolderIndex.value !== -1 ? 600 : 0,
          withTiming(isContentVisible ? 1 : 0, {
            duration: 300,
            easing: easing,
          })
        ),
      };
    });

    const animatedPlaceholderStyle = useAnimatedStyle(() => {
      const isContentVisible = activeFolderIndex.value !== -1;

      return {
        opacity: isContentVisible
          ? withDelay(400, withTiming(0, { duration: 300, easing: easing }))
          : withTiming(1, { duration: 300, easing: easing }),
      };
    });

    return (
      <Animated.View style={[styles.card, rDocStyle]}>
        {/* Notes Content */}
        <Animated.View
          style={[
            animatedContentStyle,
            StyleSheet.absoluteFill,
            { flex: 1, padding: 10 },
          ]}
        >
          <Text
            style={{
              fontFamily: "medium",
              fontSize: 20,
              color: "#363636",
              marginBottom: 5,
            }}
          >
            {docData.title}
          </Text>
          <View>
            {docData.preview.map((preview, index) => {
              return (
                <Text
                  key={index}
                  style={{
                    fontFamily: "regular",
                    fontSize: 16,
                    color: "#818080",
                  }}
                >
                  {preview}
                </Text>
              );
            })}
          </View>

          <View
            style={{
              height: 40,
              width: "100%",
              marginTop: "auto",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 16,
                color: "#818080",
                textTransform: "uppercase",
              }}
            >
              {formattedDate(docData.createdAt)}
            </Text>
            <Entypo name="dots-three-horizontal" size={16} color="#818080" />
          </View>

          <AnimatedBlurView
            pointerEvents="none"
            tint="extraLight"
            intensity={folderBlurIntensity}
            style={[StyleSheet.absoluteFill]}
          />
        </Animated.View>

        <Animated.View
          style={[
            animatedPlaceholderStyle,
            StyleSheet.absoluteFill,
            { padding: 10, gap: 2 },
          ]}
        >
          {placeholders.map((placeholder) => (
            <Placeholder key={placeholder.id} width={placeholder.width} />
          ))}
        </Animated.View>
      </Animated.View>
    );
  }
);

DocumentCard.displayName = "DocumentCard";

interface DocsProps {
  currentFolderIndex: number;
  activeFolderIndex: SharedValue<number>;
  docsData: Note[];
}

const Docs: React.FC<DocsProps> = ({
  currentFolderIndex,
  activeFolderIndex,
  docsData,
}) => {
  const arrayData = useMemo(() => chunkArray(docsData, 3), [docsData]);
  return (
    <View style={styles.container}>
      {arrayData.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((doc, index) => (
            <DocumentCard
              key={doc.id}
              docIndex={index}
              currentFolderIndex={currentFolderIndex}
              activeFolderIndex={activeFolderIndex}
              docData={doc}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default memo(Docs);

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  row: {
    flexDirection: "row",
  },
  card: {
    position: "absolute",
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  placeholder: {
    height: 8,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
  },
});
