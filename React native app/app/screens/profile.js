import React, { Component } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  AsyncStorage
} from "react-native";
import { Text, Button, Avatar, Divider } from "react-native-elements";
import decode from "jwt-decode";
import axios from "axios";
import moment from "moment";

export class Profile extends Component {
  state = {
    user: {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      country: "",
      address: "",
      phone_number: "",
      gender: "",
      avatar: null,
      birth_date: ""
    },
    token: "",
    userId: ""
  };
  loadData() {
    AsyncStorage.getItem("userToken").then(token => {
      const user = decode(token);
      this.setState({ token: token, userId: user._id });
      axios
        .get("http://80.211.10.131:3000/api/user/" + user._id, {
          headers: {
            Authorization: `${token}`
          }
        })
        .then(res => {
          this.setState({
            user: {
              email: res.data.user.email,
              username: res.data.user.username,
              first_name: res.data.user.first_name,
              last_name: res.data.user.last_name,
              country: res.data.user.country,
              address: res.data.user.address,
              phone_number: res.data.user.phone_number,
              gender: res.data.user.gender,
              avatar: res.data.user.avatar,
              birth_date: res.data.user.birth_date
            }
          });
        });
    });
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.loadData();
    this.focusListener = navigation.addListener("didFocus", () => {
      this.loadData();
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
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
          <View style={{ flex: 1, margin: 15 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri: "http://80.211.10.131:3000/" + this.state.user.avatar
                }}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontWeight: "bold"
                  }}
                >
                  {this.state.user.username}
                </Text>
                <Text
                  style={{
                    alignSelf: "center"
                  }}
                >
                  {this.state.user.email}
                </Text>
                <Button
                  onPress={() =>
                    this.props.navigation.navigate("EditProfile", {
                      profile: this.state.user,
                      userId: this.state.userId,
                      token: this.state.token
                    })
                  }
                  buttonStyle={{
                    backgroundColor: "#009688"
                  }}
                  containerStyle={{
                    marginTop: 15,
                    alignSelf: "center",
                    width: "90%"
                  }}
                  title="Edit Profile"
                />
              </View>
            </View>
            <Divider
              style={{
                backgroundColor: "#009688",
                marginTop: 15,
                marginLeft: 15,
                marginRight: 15
              }}
            />
            <View style={{ margin: 15 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 10
                }}
              >
                First Name:
              </Text>
              <Text>{this.state.user.first_name}</Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 10
                }}
              >
                Last Name:
              </Text>
              <Text>{this.state.user.last_name}</Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 10
                }}
              >
                Birth Date:
              </Text>
              <Text>{moment(this.state.user.birth_date).format("LL")}</Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 10
                }}
              >
                Gender:
              </Text>
              <Text>{this.state.user.gender}</Text>

              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 10
                }}
              >
                Country:
              </Text>
              <Text>{this.state.user.country}</Text>

              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 10
                }}
              >
                Address:
              </Text>
              <Text>{this.state.user.address}</Text>

              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 10
                }}
              >
                Phone Number:
              </Text>
              <Text>{this.state.user.phone_number}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default Profile;
