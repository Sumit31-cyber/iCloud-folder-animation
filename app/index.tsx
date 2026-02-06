import Folder from "@/components/folders";
import Header from "@/components/header";
import Footer from "@/components/ui/footer";
import { notesData } from "@/constants/docsData";
import React, { useState } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function App() {
  const isOpen = useSharedValue<boolean>(false);
  const [activeFolderIndex, setActiveFolderIndex] = useState(-1);
  const openedFolderIndex = useSharedValue(-1);
  const handleOnFolderPress = (currentIndex: number) => {
    isOpen.value = !isOpen.value;
    openedFolderIndex.value = currentIndex;
    setActiveFolderIndex(currentIndex);
  };

  return (
    <View
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
      <View
        style={{
          alignItems: "center",
          flex: 1,
          gap: 20,
          marginTop: 20,
        }}
      >
        {notesData.map((item, index) => {
          return (
            <Folder
              key={item.id}
              height={180}
              width={350}
              index={index}
              item={item}
              gradientColor={item.gradientColor}
              onPress={() => {
                handleOnFolderPress(index);
              }}
              openedFolderIndex={openedFolderIndex}
            />
          );
        })}
      </View>
      <Footer
        isOpen={isOpen}
        notesCount={notesData[activeFolderIndex]?.totalNotes ?? 0}
      />
    </View>
  );
}
