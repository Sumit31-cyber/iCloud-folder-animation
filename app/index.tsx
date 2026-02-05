import Folder from "@/components/folders";
import Header from "@/components/header";
import Footer from "@/components/ui/footer";
import React from "react";
import { ColorValue, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

interface FolderDataType {
  id: number;
  gradientColor: GradientColors;
}
const _folderData: FolderDataType[] = [
  {
    id: 0,
    gradientColor: ["#ef4065", "#eb1943"],
  },
  {
    id: 1,
    gradientColor: ["#3488ff", "#18aaeb"],
  },
  {
    id: 2,
    gradientColor: ["#ffea00", "#ffa200"],
  },
];
export default function App() {
  const isOpen = useSharedValue<boolean>(false);
  const openedFolderIndex = useSharedValue(-1);
  const handleOnFolderPress = () => {
    isOpen.value = !isOpen.value;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F5F5F5",
      }}
    >
      <Header
        isOpen={isOpen}
        onBackButtonPress={() => {
          openedFolderIndex.value = -1;
          isOpen.value = !isOpen.value;
        }}
      />
      <View style={{ alignItems: "center", flex: 1, gap: 20 }}>
        {_folderData.map((item, index) => {
          return (
            <Folder
              key={item.id}
              height={180}
              width={350}
              gradientColor={item.gradientColor}
              onPress={() => {
                handleOnFolderPress();
                openedFolderIndex.value = index;
              }}
              openedFolderIndex={openedFolderIndex}
              index={index}
            />
          );
        })}
      </View>
      <Footer isOpen={isOpen} />
    </SafeAreaView>
  );
}
