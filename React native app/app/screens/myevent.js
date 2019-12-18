import React, { Component } from "react";
import { FlatList, View, TouchableOpacity, AsyncStorage } from "react-native";
import { Text, Card, Avatar, Icon } from "react-native-elements";
import moment from "moment";
import decode from "jwt-decode";
import axios from "axios";

export class MyEvents extends Component {
  state = {
    events: [],
    message: "",
    isFetching: false
  };

  async loadData() {
    const token = await AsyncStorage.getItem("userToken");
    const user = decode(token);
    axios
      .get("http://80.211.10.131:3000/api/event/user/" + user._id)
      .then(res => this.setState({ events: res.data }))
      .catch(err => this.setState({ message: res.data }));
    this.setState({ isFetching: false });
  }
  onRefresh() {
    this.setState({ isFetching: true });
    this.loadData();
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.loadData();
    this.focusListener = navigation.addListener("didFocus", () => {
      this.onRefresh();
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    return (
      <View>
        <FlatList
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          data={this.state.events}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  this.props.navigation.navigate("Details", {
                    id: item._id,
                    title: item.title
                  })
                }
              >
                <Card containerStyle={{ margin: 0 }}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Avatar
                      source={{
                        uri: "http://80.211.10.131:3000/" + item.image
                      }}
                      containerStyle={{
                        borderWidth: 0.5,
                        borderRadius: 10,
                        overflow: "hidden",
                        marginRight: 5
                      }}
                      size="large"
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {item.title}
                      </Text>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Text
                          style={{
                            padding: 5,
                            textAlign: "center",
                            color: "#616161"
                          }}
                        >
                          Date: {moment(item.event_date).format("L")}
                        </Text>
                      </View>
                    </View>
                    <Icon name="chevron-right" />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item._id}
        />
      </View>
    );
  }
}

export default MyEvents;
