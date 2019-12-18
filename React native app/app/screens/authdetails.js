import React, { Component } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  AsyncStorage,
  Alert
} from "react-native";
import { Image, Text, Card, Divider, Button } from "react-native-elements";
import axios from "axios";
import { Ionicons, MaterialIcons, EvilIcons, Entypo } from "@expo/vector-icons";
import decode from "jwt-decode";
import moment from "moment";
import { Header } from "react-navigation";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Fab } from "native-base";

export class DetailsAuth extends Component {
  state = {
    eventDetail: [],
    Participation: "Participate",
    buttonColor: "#80cbc4",
    userId: "",
    showButton: false,
    showActionButton: false,
    active: false
  };
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };
  loadData() {
    const { navigation } = this.props;
    const id = navigation.getParam("id");
    axios.get("http://80.211.10.131:3000/api/event/" + id).then(res => {
      this.setState({ eventDetail: res.data });
      AsyncStorage.getItem("userToken").then(token => {
        const user = decode(token);
        this.setState({ userId: user._id });
        if (this.state.eventDetail.owner !== user._id) {
          this.setState({ showButton: true });
        } else {
          this.setState({ showActionButton: true });
        }

        if (this.state.eventDetail.subscribers.includes(user._id)) {
          this.setState({
            Participation: "Participated",
            buttonColor: "#009688"
          });
        }
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

  onPressHandler = () => {
    const { navigation } = this.props;
    const id = navigation.getParam("id");
    AsyncStorage.getItem("userToken").then(token => {
      if (token !== null) {
        axios
          .patch(
            "http://80.211.10.131:3000/api/event/" + id + "/sub",
            {},
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `${token}`
              }
            }
          )
          .then(() => {
            {
              if (this.state.Participation === "Participated") {
                this.setState({
                  Participation: "Participate",
                  buttonColor: "#80cbc4"
                });
              } else if (this.state.Participation === "Participate") {
                this.setState({
                  Participation: "Participated",
                  buttonColor: "#009688"
                });
              }
            }
          })
          .catch(err => {
            console.warn(err.response);
          });
      }
    });
  };
  _showAlert = () => {
    Alert.alert(
      "Are you sure you want to delete this event ?",
      "",

      [
        { text: "No", onPress: () => {}, style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            this.deleteEvent();
          }
        }
      ],
      { cancelable: false }
    );
  };

  deleteEvent() {
    const { navigation } = this.props;
    const id = navigation.getParam("id");
    axios.delete("http://80.211.10.131:3000/api/event/" + id).then(() => {
      this.props.navigation.goBack();
    });
  }

  render() {
    const { height, width } = Dimensions.get("window");
    const heightToRemove = getStatusBarHeight() + 60 + Header.HEIGHT;
    return (
      <View style={{ flex: 1, margin: 5 }}>
        <View style={{ height: height - heightToRemove }}>
          <ScrollView>
            <View style={{ alignItems: "center", margin: 10 }}>
              <Image
                source={{
                  uri:
                    "http://80.211.10.131:3000/" + this.state.eventDetail.image
                }}
                style={{ width: 300, height: 200 }}
                containerStyle={{
                  borderWidth: 0.5
                }}
              />
            </View>
            <Divider style={{ backgroundColor: "#009688", margin: 15 }} />
            <Text h4>Details:</Text>
            <Text>{this.state.eventDetail.details}</Text>
            <Divider style={{ backgroundColor: "#009688", margin: 15 }} />
            <View style={{ flexDirection: "row" }}>
              <EvilIcons name="clock" size={18} />
              <Text>
                {moment(this.state.eventDetail.event_date).format(
                  "dddd, MMMM Do YYYY, h:mm"
                )}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="place" size={18} />
              <Text>{this.state.eventDetail.address}</Text>
            </View>
          </ScrollView>
        </View>
        {this.state.showButton && (
          <Button
            onPress={this.onPressHandler}
            buttonStyle={{
              backgroundColor: this.state.buttonColor,
              borderRadius: 30
            }}
            containerStyle={{
              alignSelf: "center",
              bottom: 0,
              position: "absolute",
              width: "50%"
            }}
            icon={
              <Ionicons name="md-checkmark-circle" size={25} color="white" />
            }
            title={this.state.Participation}
          />
        )}

        {this.state.showActionButton && (
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: "#009688" }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <Entypo name="plus" />
            <Button
              style={{ backgroundColor: "red" }}
              onPress={this._showAlert}
            >
              <MaterialIcons name="delete" size={25} color="white" />
            </Button>
            <Button
              style={{ backgroundColor: "#3B5998" }}
              onPress={() =>
                this.props.navigation.navigate("EditEvent", {
                  event: this.state.eventDetail
                })
              }
            >
              <MaterialIcons name="edit" size={25} color="white" />
            </Button>
          </Fab>
        )}
      </View>
    );
  }
}

export default DetailsAuth;
