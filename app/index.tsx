import Folder from "@/components/folders";
import Header from "@/components/header";
import React from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const isOpen = useSharedValue<boolean>(false);
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
      <Header isOpen={isOpen} />
      <View style={{ alignItems: "center", flex: 1, gap: 20 }}>
        <Folder height={180} width={350} onPress={handleOnFolderPress} />
        <Folder
          height={180}
          width={350}
          gradientColor={["#3488ff", "#18aaeb"]}
          onPress={handleOnFolderPress}
        />
        <Folder
          height={180}
          width={350}
          gradientColor={["#ffea00", "#ffa200"]}
          onPress={handleOnFolderPress}
        />
      </View>
    </SafeAreaView>
  );
}
