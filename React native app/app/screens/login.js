import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  AsyncStorage,
  StyleSheet,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";

import { Input, Image, Button, Text } from "react-native-elements";
import axios from "axios";

import logoImg from "../../assets/images/logo.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: ""
    };
  }
  static navigationOptions = {
    header: null
  };
  onLogin = () => {
    const user = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("http://80.211.10.131:3000/api/user/login", user)
      .then(async response => {
        await AsyncStorage.setItem("userToken", response.data.token);
        ToastAndroid.show("Successfuly Logged in !", ToastAndroid.SHORT);
        this.setState({ email: "", password: "", errorMessage: "" });
        this.props.navigation.navigate("Auth");
      })
      .catch(err => {
        if (
          err.response.data.message === "Invalid e-mail." ||
          err.response.data.message === "Invalid Password."
        )
          this.setState({ errorMessage: "Invalid email or password." });
      });
  };
  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center"
        }}
        behavior="padding"
        enabled
      >
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.centerElements}>
              <Image source={logoImg} style={styles.LogoStyle} />
            </View>
            <View style={styles.inputStyle}>
              <Input
                placeholder="Email"
                leftIconContainerStyle={{ padding: 5 }}
                leftIcon={{
                  size: 18,
                  type: "font-awesome",
                  name: "envelope",
                  color: "#009688"
                }}
                keyboardType="email-address"
                onChangeText={Email => this.setState({ email: Email })}
                value={this.state.email}
              />
              <Input
                placeholder="Password"
                secureTextEntry={true}
                leftIconContainerStyle={{ padding: 5 }}
                leftIcon={{
                  type: "font-awesome",
                  name: "lock",
                  color: "#009688"
                }}
                onChangeText={Password => this.setState({ password: Password })}
                value={this.state.password}
                errorMessage={this.state.errorMessage}
              />
            </View>

            <TouchableOpacity>
              <Text style={styles.textAlignRight}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              raised
              title="LOGIN"
              onPress={this.onLogin}
              buttonStyle={styles.buttonStyle}
            />
            <View style={styles.centerElements}>
              <Text>Do not have account?</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Register")}
              >
                <Text style={styles.textAlignCenter}>Create new account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", padding: 15 },
  LogoStyle: { width: 390, height: 225 },
  inputStyle: { marginBottom: 20 },
  centerElements: { alignItems: "center", marginTop: 40 },
  textAlignRight: { textAlign: "right", marginRight: 15, marginBottom: 10 },
  textAlignCenter: { textAlign: "center", color: "#009688", marginTop: 5 },
  buttonStyle: { backgroundColor: "#009688" }
});

export default Login;
