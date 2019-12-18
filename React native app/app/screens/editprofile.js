import React, { Component } from "react";
import { Input, Text, Button } from "react-native-elements";
import {
  View,
  Picker,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import FormData from "form-data";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";

export class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      country: "",
      address: "",
      phone_number: "",
      gender: "",
      avatar: null,
      birth_date: "",
      errorMessage: {
        first_name: "",
        last_name: "",
        country: "",
        address: "",
        phone_number: "",
        gender: "",
        avatar: "",
        birth_date: ""
      },
      isDateTimePickerVisible: false,
      dateButtonTittle: "Click here to select a date ",
      spinner: false
    };
  }
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ birth_date: date.toString() });
    this.setState({
      dateButtonTittle: moment(date).format("LL")
    });
    this.hideDateTimePicker();
  };
  componentDidMount() {
    this.getPermissionAsync();
    const { navigation } = this.props;
    const profile = navigation.getParam("profile");
    this.setState({
      first_name: profile.first_name,
      last_name: profile.last_name,
      country: profile.country,
      address: profile.address,
      phone_number: profile.phone_number,
      gender: profile.gender,
      avatar: profile.avatar,
      birth_date: profile.birth_date,
      dateButtonTittle: moment(profile.birth_date).format("LL")
    });
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
    if (!result.cancelled) {
      this.setState({
        avatar: result.uri
      });
    }
  };
  onSubmitEvent = () => {
    this.setState({
      spinner: true,
      errorMessage: {
        first_name: "",
        last_name: "",
        country: "",
        address: "",
        phone_number: "",
        gender: "",
        avatar: "",
        birth_date: ""
      }
    });
    if (this.state.avatar !== null) {
      const { navigation } = this.props;
      let token = navigation.getParam("token");
      let userId = navigation.getParam("userId");

      let data = new FormData();
      let imgPart = this.state.avatar.split("/");
      let imageName = imgPart[imgPart.length - 1];
      let uriParts = this.state.avatar.split(".");
      let fileType = uriParts[uriParts.length - 1];
      data.append("first_name", this.state.first_name);
      data.append("last_name", this.state.last_name);
      data.append("country", this.state.country);
      data.append("address", this.state.address);
      data.append("phone_number", this.state.phone_number);
      data.append("gender", this.state.gender);
      data.append("birth_date", this.state.birth_date);
      data.append("avatar", {
        uri: this.state.avatar,
        name: imageName,
        type: `image/${fileType}`
      });
      axios
        .patch("http://80.211.10.131:3000/api/user/" + userId, data, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `${token}`
          }
        })
        .then(() => {
          this.setState({ spinner: false });
          this.props.navigation.goBack();
        })
        .catch(err => {
          this.setState({ spinner: false });
        });
    } else {
      this.setState({
        spinner: false,
        errorMessage: { avatar: "avatar is required" }
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
          <View style={{ flex: 1, marginTop: 50 }}>
            <ImageBackground
              source={{
                uri: "http://80.211.10.131:3000/" + this.state.avatar
              }}
              style={{
                width: 180,
                height: 180,
                opacity: 0.7,
                zIndex: 0,
                justifyContent: "center",
                alignSelf: "center"
              }}
              imageStyle={{ borderRadius: 100 }}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  alignSelf: "center",
                  zIndex: 1,
                  position: "absolute"
                }}
                onPress={this._pickImage}
              >
                <MaterialIcons
                  name="add-a-photo"
                  size={100}
                  style={{
                    color: "white",
                    padding: 5
                  }}
                />
              </TouchableOpacity>
            </ImageBackground>

            <Input
              placeholder="First Name "
              labelStyle={{ marginTop: 5, color: "#009688" }}
              label="First Name:"
              onChangeText={first_name =>
                this.setState({ first_name: first_name })
              }
              value={this.state.first_name}
              errorMessage={this.state.errorMessage.first_name}
            />
            <Input
              placeholder="Last name "
              labelStyle={{ marginTop: 5, color: "#009688" }}
              label="Last Name:"
              onChangeText={last_name =>
                this.setState({ last_name: last_name })
              }
              value={this.state.last_name}
              errorMessage={this.state.errorMessage.last_name}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#009688",
                marginLeft: 10,
                marginTop: 10
              }}
            >
              Gender:
            </Text>
            <Picker
              mode={"dialog"}
              selectedValue={this.state.gender}
              style={{ height: 50, width: "100%" }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ gender: itemValue })
              }
            >
              <Picker.Item label="Select your gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#009688",
                marginLeft: 10,
                marginTop: 10
              }}
            >
              Birthday date:
            </Text>
            <Button
              type="clear"
              title={this.state.dateButtonTittle}
              onPress={this.showDateTimePicker}
              titleStyle={{ color: "gray" }}
            />
            <Input
              placeholder="Country "
              labelStyle={{ marginTop: 5, color: "#009688" }}
              label="Country:"
              onChangeText={country => this.setState({ country: country })}
              value={this.state.country}
              errorMessage={this.state.errorMessage.country}
            />
            <Input
              placeholder="Address "
              labelStyle={{ marginTop: 5, color: "#009688" }}
              label="Address:"
              onChangeText={address => this.setState({ address: address })}
              value={this.state.address}
              errorMessage={this.state.errorMessage.address}
            />
            <Input
              keyboardType="numeric"
              maxLength={10}
              placeholder="Phone number "
              labelStyle={{ marginTop: 5, color: "#009688" }}
              label="Phone number:"
              onChangeText={phone_number =>
                this.setState({ phone_number: phone_number })
              }
              value={this.state.phone_number}
              errorMessage={this.state.errorMessage.phone_number}
            />
            <Button
              onPress={this.onSubmitEvent}
              buttonStyle={{
                backgroundColor: "#009688",
                borderRadius: 30
              }}
              containerStyle={{
                marginTop: 30,
                marginBottom: 15,
                alignSelf: "center",
                width: "50%"
              }}
              title="Update profile"
            />
            <Spinner
              visible={this.state.spinner}
              textContent={"Submitting changes ..."}
              textStyle={{ color: "#FFF" }}
            />
            <DateTimePicker
              maximumDate={new Date()}
              mode={"date"}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default EditProfile;
