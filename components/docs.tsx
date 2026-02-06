import { easing, formattedDate } from "@/constants/constants";
import { chunkArray, Note } from "@/constants/docsData";
import { Entypo } from "@expo/vector-icons";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withDelay,
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

const DocumentCard: React.FC<DocumentCardProps> = memo(
  ({ currentFolderIndex, activeFolderIndex, docIndex, docData }) => {
    // const [showContent, setShowContent] = useState(false);

    // useAnimatedReaction(
    //   () => activeFolderIndex.value !== -1,
    //   (isOpen, wasOpen) => {
    //     if (isOpen !== wasOpen) {
    //       runOnJS(setShowContent)(isOpen);
    //     }
    //   }
    // );
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
              isActive ? expandedTranslateY - GAP * 1.5 : stackStyle.translateY,
              { duration: _animationDuration, easing: easing }
            ),
          },
        ],
      };
    });

    const animatedContentStyle = useAnimatedStyle(() => {
      const isContentVisible = activeFolderIndex.value !== -1;

      return {
        opacity: withDelay(
          activeFolderIndex.value !== -1 ? 500 : 0,
          withTiming(isContentVisible ? 1 : 0)
        ),
      };
    });
    const animatedPlaceholderStyle = useAnimatedStyle(() => {
      const isContentVisible = activeFolderIndex.value !== -1;

      return {
        opacity: isContentVisible
          ? withDelay(400, withTiming(0))
          : withTiming(1),
      };
    });

    return (
      <Animated.View style={[styles.card, rDocStyle]}>
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
