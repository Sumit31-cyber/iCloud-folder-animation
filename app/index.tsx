import { Redirect } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const Home = () => {
  return <Redirect href={"/(tabs)/first"} />;
};

export default Home;

const styles = StyleSheet.create({});
