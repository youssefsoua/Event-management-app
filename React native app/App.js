import React from "react";
import { View } from "react-native";
import Root from "./app/config/router";
import { useScreens } from "react-native-screens";
useScreens();

const App = () => {
  return <Root/>;
};

export default App;
