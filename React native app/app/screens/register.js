import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { Input, Image, Button } from "react-native-elements";
import axios from "axios";

import logoImg from "../../assets/images/logo.png";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    };
  }
  static navigationOptions = {
    header: null
  };

  onRegister = () => {
    this.setState({
      errorMessage: {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    });
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errorMessage: { confirmPassword: "Password does not match" }
      });
    } else {
      const user = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      };
      axios
        .post("http://80.211.10.131:3000/api/user/register", user)
        .then(() => {
          this.setState({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            errorMessage: {
              username: "",
              email: "",
              password: "",
              confirmPassword: ""
            }
          });
          ToastAndroid.show("Successfuly registered!", ToastAndroid.SHORT);
          this.props.navigation.navigate("Login");
        })
        .catch(err => {
          if (
            err.response.data.message === "email must be a valid email" ||
            err.response.data.message ===
              "email length must be at least 6 characters long"
          ) {
            this.setState({
              errorMessage: { email: "Invalid email address." }
            });
          } else if (
            err.response.data.message === "email is not allowed to be empty"
          ) {
            this.setState({
              errorMessage: {
                email: "Email is required."
              }
            });
          } else if (err.response.data.message === "Email already exist") {
            this.setState({
              errorMessage: { email: "Email already in use." }
            });
          } else if (err.response.data.message === "Username already exist") {
            this.setState({
              errorMessage: { username: "Username already taken." }
            });
          } else if (
            err.response.data.message ===
            "username length must be at least 6 characters long"
          ) {
            this.setState({
              errorMessage: {
                username: "Username length must be at least 6 characters long."
              }
            });
          } else if (
            err.response.data.message === "username is not allowed to be empty"
          ) {
            this.setState({
              errorMessage: {
                username: "Username is required."
              }
            });
          } else if (
            err.response.data.message ===
            "password length must be at least 6 characters long"
          ) {
            this.setState({
              errorMessage: {
                password: "Password length must be at least 6 characters long."
              }
            });
          } else if (
            err.response.data.message === "password is not allowed to be empty"
          ) {
            this.setState({
              errorMessage: {
                password: "Password is required."
              }
            });
          } else {
            ToastAndroid.show(
              "Server not responding, try again later",
              ToastAndroid.LONG
            );
          }
        });
    }
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
            <View style={styles.inputViewStyle}>
              <Input
                label="Username"
                onChangeText={Username => this.setState({ username: Username })}
                value={this.state.username}
                errorMessage={this.state.errorMessage.username}
              />
            </View>
            <View style={styles.inputViewStyle}>
              <Input
                label="Email"
                keyboardType="email-address"
                onChangeText={Email => this.setState({ email: Email })}
                value={this.state.email}
                errorMessage={this.state.errorMessage.email}
              />
            </View>
            <View style={styles.inputViewStyle}>
              <Input
                label="Password"
                secureTextEntry={true}
                onChangeText={Password => this.setState({ password: Password })}
                value={this.state.password}
                errorMessage={this.state.errorMessage.password}
              />
            </View>
            <View style={styles.inputViewStyle}>
              <Input
                label="Confirm Password"
                secureTextEntry={true}
                onChangeText={ConfirmPassword =>
                  this.setState({ confirmPassword: ConfirmPassword })
                }
                value={this.state.confirmPassword}
                errorMessage={this.state.errorMessage.confirmPassword}
              />
            </View>

            <Button
              raised
              title="REGISTER"
              buttonStyle={styles.buttonStyle}
              onPress={this.onRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 15,
    paddingRight: 15
  },
  LogoStyle: { width: 325, height: 187.5 },
  inputViewStyle: { marginBottom: 20 },
  buttonStyle: { backgroundColor: "#009688" },
  centerElements: { alignItems: "center" }
});
export default Register;
