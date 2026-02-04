import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ColorValue, Pressable, StyleSheet, View } from "react-native";

type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

const Folder = ({
  height = 100,
  width = 180,
  notchHeight = 22,
  borderRadius = 18,
  gradientColor = ["#ef4065", "#eb1943"],
  onPress,
}: {
  height?: number;
  width?: number;
  notchHeight?: number;
  borderRadius?: number;
  gradientColor?: GradientColors;
  onPress: () => void;
}) => {
  const renderPlaceholders = () => {
    return (
      <>
        {new Array(3)
          .fill(0)
          .map((_, index) => ({ id: index }))
          .map((item, index) => {
            return (
              <View
                key={item.id}
                style={{
                  height: 8,
                  width:
                    index === 0
                      ? "100%"
                      : index === 1
                      ? "40%"
                      : index === 2
                      ? "70%"
                      : 0,
                  backgroundColor: "#eeeeee",
                  borderRadius: 10,
                }}
              ></View>
            );
          })}
      </>
    );
  };
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          height: height,
          width: width,
          flexDirection: "row",
          borderRadius: borderRadius,
          overflow: "hidden",
        }}
      >
        {/* Top Notch Border */}
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

        {/* Second Row */}
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
        <View
          style={{
            position: "absolute",
            height: height - notchHeight,
            width: "100%",
            bottom: 0,
          }}
        >
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                height: "85%",
                aspectRatio: 0.8,
                backgroundColor: "#fff",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                borderRadius: 6,
                gap: 2,

                // alignItems: "center",
                padding: "3%",
                zIndex: 3,
                transform: [
                  {
                    rotate: "-20deg",
                  },
                  {
                    translateX: 5,
                  },
                ],
              }}
            >
              {renderPlaceholders()}
            </View>
            <View
              style={{
                height: "85%",
                aspectRatio: 0.8,
                backgroundColor: "#fff",
                borderRadius: 6,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                zIndex: 2,
                gap: 2,
                // alignItems: "center",
                padding: "3%",
                transform: [
                  {
                    rotate: "-20deg",
                  },
                  {
                    translateY: 5,
                  },
                ],
              }}
            >
              {renderPlaceholders()}
            </View>
            <View
              style={{
                height: "85%",
                aspectRatio: 0.8,
                backgroundColor: "#fff",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                borderRadius: 6,
                zIndex: 1,
                gap: 2,
                // alignItems: "center",
                padding: "3%",
                transform: [
                  {
                    rotate: "12deg",
                  },
                  {
                    translateY: 10,
                  },
                  {
                    translateX: -8,
                  },
                ],
              }}
            >
              {renderPlaceholders()}
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              height: "60%",
              width: "100%",
              bottom: 0,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
              borderWidth: StyleSheet.hairlineWidth * 2,
              borderColor: `${String(gradientColor[1])}10`,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            <BlurView
              intensity={20}
              style={[StyleSheet.absoluteFill]}
            ></BlurView>
            <LinearGradient
              // Background Linear Gradient
              colors={gradientColor}
              style={{
                flex: 1,
                borderBottomLeftRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
                opacity: 0.4,
              }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default Folder;
