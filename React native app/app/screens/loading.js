import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Image, Text } from "react-native-elements";
import { Spinner } from "native-base";
import axios from "axios";
import logoImg from "../../assets/images/logo.png";

class Loading extends Component {
  constructor(props) {
    super(props);
    AsyncStorage.getItem("userToken").then(token => {
      if (token !== null) {
        axios
          .post("http://80.211.10.131:3000/api/user/refreshSession", {
            token: token
          })
          .then(response => {
            AsyncStorage.setItem("userToken", response.data.token);
            this.props.navigation.navigate("Auth");
          })
          .catch(err => {
            if (err.response.data.message === "invalid token")
              this.props.navigation.navigate("Guest");
          });
      } else {
        this.props.navigation.navigate("Guest");
      }
    });
  }
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.centerElements}>
          <Image source={logoImg} style={styles.LogoStyle} />
        </View>
        <View style={styles.centerElements}>
          <Text style={styles.textAlignCenter}>Loading...</Text>
          <Spinner color="#009688" />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", justifyContent: "center" },
  LogoStyle: { width: 455, height: 262.5 },
  textAlignCenter: { textAlign: "center", color: "#009688", marginTop: 5 },
  centerElements: { alignItems: "center" }
});

export default Loading;
