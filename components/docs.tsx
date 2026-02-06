import { easing } from "@/constants/constants";
import { chunkArray, Note } from "@/constants/docsData";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { _animationDuration } from "./folders";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const ROW_SIZE = 2;

const CARD_WIDTH = 80;
const CARD_HEIGHT = 100;
const EXP_CARD_HEIGHT = CARD_HEIGHT * 2;

const GAP = 20;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PLACEHOLDER_WIDTHS = ["100%", "40%", "70%"] as const;
const PLACEHOLDER_COUNT = 3;

const CARD_STYLES = [
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

/* -------------------------------------------------------------------------- */
/*                               Placeholder UI                               */
/* -------------------------------------------------------------------------- */

interface PlaceholderProps {
  width: string;
}

const Placeholder: React.FC<PlaceholderProps> = memo(({ width }) => (
  <View style={[styles.placeholder, { width: width as any }]} />
));

Placeholder.displayName = "Placeholder";

/* -------------------------------------------------------------------------- */
/*                               Document Card                                */
/* -------------------------------------------------------------------------- */

interface DocumentCardProps {
  currentFolderIndex: number;
  activeFolderIndex: SharedValue<number>;
  docIndex: number;
  docData: Note;
}

const DocumentCard: React.FC<DocumentCardProps> = memo(
  ({ currentFolderIndex, activeFolderIndex, docIndex, docData }) => {
    /**
     * Placeholder lines inside document card
     * Static + memoized
     */
    const placeholders = useMemo(
      () =>
        Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => ({
          id: index,
          width: PLACEHOLDER_WIDTHS[index],
        })),
      []
    );

    const rDocStyle = useAnimatedStyle(() => {
      const isActive = currentFolderIndex === activeFolderIndex.value;
      const currentIndex = docData.id;
      const stackStyle = CARD_STYLES[Math.min(docIndex, 2)];

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
        height: withTiming(isActive ? EXP_CARD_HEIGHT : CARD_HEIGHT, {
          duration: _animationDuration,
          easing: easing,
        }),

        width: withTiming(
          isActive ? (SCREEN_WIDTH - GAP * 3) * 0.5 : CARD_WIDTH,
          { duration: _animationDuration, easing: easing }
        ),

        opacity: withTiming(isActive || currentIndex <= 2 ? 1 : 0.8, {
          duration: _animationDuration,
          easing: easing,
        }),

        borderRadius: withTiming(isActive ? 20 : 6, {
          duration: _animationDuration,
          easing: easing,
        }),

        left: withTiming(isActive ? expandedLeft : collapsedLeft, {
          duration: _animationDuration,
          easing: easing,
        }),

        transform: [
          {
            rotate: withTiming(isActive ? "0deg" : stackStyle.rotation, {
              duration: _animationDuration,
              easing: easing,
            }),
          },
          {
            translateY: withTiming(
              isActive ? expandedTranslateY : stackStyle.translateY,
              { duration: _animationDuration, easing: easing }
            ),
          },
        ],
      };
    });

    return (
      <Animated.View style={[styles.card, rDocStyle]}>
        {placeholders.map((placeholder) => (
          <Placeholder key={placeholder.id} width={placeholder.width} />
        ))}
      </Animated.View>
    );
  }
);

DocumentCard.displayName = "DocumentCard";

/* -------------------------------------------------------------------------- */
/*                                    Docs                                    */
/* -------------------------------------------------------------------------- */

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

  if (__DEV__) {
    console.log("[Docs] chunked docs:", arrayData);
  }

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

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

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
    padding: "3%",
    gap: 2,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  placeholder: {
    height: 8,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
  },
});
