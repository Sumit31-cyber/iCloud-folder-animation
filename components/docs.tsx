import React, { useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

interface PlaceholderConfig {
  id: number;
  width: string;
}

interface CardStyleItem {
  rotation: string;
  translateX?: number;
  translateY?: number;
  zIndex: number;
}

interface CardStyle {
  initialPos: CardStyleItem;
  finalPos: CardStyleItem;
}

const PLACEHOLDER_WIDTHS = ["100%", "40%", "70%"] as const;
const PLACEHOLDER_COUNT = 3;

const CARD_STYLES: readonly CardStyle[] = [
  {
    initialPos: { rotation: "-20deg", translateX: 5, zIndex: 3 },
    finalPos: { rotation: "-20deg", translateX: 5, zIndex: 3 },
  },
  {
    initialPos: { rotation: "-20deg", translateY: 5, zIndex: 2 },
    finalPos: { rotation: "-20deg", translateY: 5, zIndex: 2 },
  },
  {
    initialPos: {
      rotation: "12deg",
      translateY: 10,
      translateX: -8,
      zIndex: 1,
    },
    finalPos: { rotation: "12deg", translateY: 10, translateX: -8, zIndex: 1 },
  },
] as const;

const Placeholder: React.FC<{ width: string }> = React.memo(() => (
  <View style={[styles.placeholder]} />
));

Placeholder.displayName = "Placeholder";

const DocumentCard: React.FC<{ cardStyle: CardStyle }> = React.memo(
  ({ cardStyle }) => {
    const placeholders = useMemo<PlaceholderConfig[]>(
      () =>
        Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => ({
          id: index,
          width: PLACEHOLDER_WIDTHS[index],
        })),
      []
    );

    const transformStyle: ViewStyle = useMemo(
      () => ({
        transform: [
          { rotate: cardStyle.initialPos.rotation },
          ...(cardStyle.initialPos.translateX
            ? [{ translateX: cardStyle.initialPos.translateX }]
            : []),
          ...(cardStyle.initialPos.translateY
            ? [{ translateY: cardStyle.initialPos.translateY }]
            : []),
        ],
        zIndex: cardStyle.initialPos.zIndex,
      }),
      [cardStyle]
    );

    return (
      <View style={[styles.card, transformStyle]}>
        {placeholders.map((placeholder) => (
          <Placeholder key={placeholder.id} width={placeholder.width} />
        ))}
      </View>
    );
  }
);

DocumentCard.displayName = "DocumentCard";

interface Props {
  currentIndex: number;
  activeIndex: SharedValue<number>;
}
const Docs: React.FC<Props> = ({ currentIndex, activeIndex }) => {
  return (
    <View style={styles.container}>
      {CARD_STYLES.map((cardStyle, index) => (
        <DocumentCard key={index} cardStyle={cardStyle} />
      ))}
    </View>
  );
};

export default Docs;

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
  },
  card: {
    height: "85%",
    aspectRatio: 0.8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Android shadow
    borderRadius: 6,
    gap: 2,
    padding: "3%",
  },
  placeholder: {
    height: 8,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
  },
});
