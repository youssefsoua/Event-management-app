import React, { Component } from "react";
import { View, StyleSheet, Image, Text, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign
} from "@expo/vector-icons";
import logoImg from "../../assets/images/logo.png";

export default class AuthSidebarMenu extends Component {
  constructor() {
    super();

    this.items = [
      {
        navOptionThumb: "home",
        navOptionName: "Home",
        screenToNavigate: "Home"
      },
      {
        navOptionThumb: "account-box",
        navOptionName: "Profile",
        screenToNavigate: "Profile"
      }
    ];
  }
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Guest");
  };
  render() {
    return (
      <View style={styles.sideMenuContainer}>
        {/*Top Large Image */}
        <Image source={logoImg} style={styles.sideMenuProfileIcon} />
        {/*Divider between Top Image and Sidebar Option*/}
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#009688",
            marginTop: 15
          }}
        />
        {/*Setting up Navigation Options from option array using loop*/}
        <View style={{ width: "80%" }}>
          {this.items.map((item, key) => (
            <View
              key={key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10
              }}
            >
              <View style={{ marginRight: 10, marginLeft: 20 }}>
                <MaterialIcons
                  name={item.navOptionThumb}
                  size={25}
                  color="#808080"
                />
              </View>
              <Text
                style={{
                  fontSize: 15
                }}
                onPress={() => {
                  this.props.navigation.navigate(item.screenToNavigate);
                }}
              >
                {item.navOptionName}
              </Text>
            </View>
          ))}
        </View>
        <Button
          iconRight
          onPress={this._signOutAsync}
          buttonStyle={{
            backgroundColor: "red",
            borderRadius: 30
          }}
          containerStyle={{
            margin: 30,
            alignSelf: "center",
            width: "50%",
            bottom: 0,
            position: "absolute"
          }}
          icon={
            <MaterialCommunityIcons name="logout" size={15} color="white" />
          }
          title="Logout"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20
  },
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 200,
    height: 150,
    marginTop: 20,
    borderRadius: 150 / 2
  }
});
