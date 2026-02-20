import Folder from "@/components/folders";
import Header from "@/components/header";
import { notesData } from "@/constants/docsData";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function FirstScreen() {
  const { colors, theme } = useAppTheme();
  const isOpen = useSharedValue<boolean>(false);
  const [activeFolderIndex, setActiveFolderIndex] = useState(-1);
  const openedFolderIndex = useSharedValue(-1);
  const scrollY = useRef<number>(0);
  const handleOnFolderPress = (currentIndex: number) => {
    isOpen.value = !isOpen.value;
    openedFolderIndex.value = currentIndex;
    setActiveFolderIndex(currentIndex);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

  const backButtonHandler = () => {
    setActiveFolderIndex(-1);
    openedFolderIndex.value = -1;
    isOpen.value = !isOpen.value;
  };

  return (
    <View
      onTouchEnd={() => console.log(activeFolderIndex)}
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
      }}
    >
      <Header isOpen={isOpen} onBackButtonPress={backButtonHandler} />
      <ScrollView
        scrollEnabled={activeFolderIndex === -1}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          alignItems: "center",
          gap: 20,
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
              gradientColor={
                theme.dark ? item.darkThemeGradient : item.lightThemeGradient
              }
              scrollY={scrollY.current}
              onPress={() => {
                handleOnFolderPress(index);
              }}
              openedFolderIndex={openedFolderIndex}
            />
          );
        })}
      </ScrollView>
      {/* <Footer
        isOpen={isOpen}
        notesCount={notesData[activeFolderIndex]?.totalNotes ?? 0}
      /> */}
    </View>
  );
}
