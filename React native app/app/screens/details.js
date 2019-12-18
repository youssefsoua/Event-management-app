import React, { Component } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { Image, Text, Divider, Button } from "react-native-elements";
import axios from "axios";
import { Entypo, MaterialIcons, EvilIcons } from "@expo/vector-icons";
import moment from "moment";
import { Header } from "react-navigation";
import { getStatusBarHeight } from "react-native-status-bar-height";

export class DetailsGuest extends Component {
  state = {
    eventDetail: []
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
    });
  }
  componentDidMount() {
    this.loadData();
  }
  _signInAsync = async () => {
    this.props.navigation.navigate("loginStack");
  };
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
        <Button
          onPress={this._signInAsync}
          buttonStyle={{
            backgroundColor: "#009688",
            borderRadius: 30
          }}
          containerStyle={{
            alignSelf: "center",
            bottom: 0,
            position: "absolute",
            width: "50%"
          }}
          icon={<Entypo name="login" size={25} color="white" />}
          title="Sign in"
        />
      </View>
    );
  }
}

export default DetailsGuest;
