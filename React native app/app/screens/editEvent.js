import React, { Component } from "react";
import { Input, Text, Button, Image } from "react-native-elements";
import {
  View,
  Picker,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  AsyncStorage
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import FormData from "form-data";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";

export class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: "",
      title: "",
      description: "",
      details: "",
      address: "",
      category: "",
      date: "",
      image: null,
      oldImage: "",
      errorMessage: {
        title: "",
        description: "",
        details: "",
        address: "",
        category: "",
        date: "",
        image: ""
      },
      isDateTimePickerVisible: false,
      dateButtonTittle: "",
      showOldImage: true,
      showNewImage: false,
      spinner: false
    };
  }
  static navigationOptions = () => {
    return {
      title: "Edit"
    };
  };
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ date: date.toString() });
    this.setState({
      dateButtonTittle: moment(date).format("dddd, MMMM Do YYYY, h:mm a")
    });
    this.hideDateTimePicker();
  };

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
        image: result.uri,
        showOldImage: false,
        showNewImage: true
      });
    }
  };
  onSubmitEvent = () => {
    console.log(this.state.eventId);
    this.setState({
      spinner: true,
      errorMessage: {
        title: "",
        description: "",
        details: "",
        address: "",
        category: "",
        date: "",
        image: ""
      }
    });
    AsyncStorage.getItem("userToken").then(token => {
      if (token !== null) {
        var data = new FormData();
        if (this.state.image !== null) {
          let imgPart = this.state.image.split("/");
          let imageName = imgPart[imgPart.length - 1];
          let uriParts = this.state.image.split(".");
          let fileType = uriParts[uriParts.length - 1];
          data.append("title", this.state.title);
          data.append("description", this.state.description);
          data.append("details", this.state.details);
          data.append("address", this.state.address);
          data.append("category", this.state.category);
          data.append("event_date", this.state.date);
          data.append("image", {
            uri: this.state.image,
            name: imageName,
            type: `image/${fileType}`
          });
        } else {
          data.append("title", this.state.title);
          data.append("description", this.state.description);
          data.append("details", this.state.details);
          data.append("address", this.state.address);
          data.append("category", this.state.category);
          data.append("event_date", this.state.date);
        }
        console.log(data);
        axios
          .patch(
            "http://80.211.10.131:3000/api/event/" + this.state.eventId,
            data,
            {
              headers: {
                "content-type": "multipart/form-data",
                Authorization: `${token}`
              }
            }
          )
          .then(() => {
            this.setState({ spinner: false });
            this.props.navigation.goBack();
          })
          .catch(err => {
            this.setState({ spinner: false });
            if (
              err.response.data.message === "title is not allowed to be empty"
            ) {
              this.setState({
                errorMessage: { title: "Title is required." }
              });
            } else if (
              err.response.data.message ===
              "description is not allowed to be empty"
            ) {
              this.setState({
                errorMessage: { description: "Description is required." }
              });
            } else if (
              err.response.data.message === "details is not allowed to be empty"
            ) {
              this.setState({
                errorMessage: { details: "Details is required." }
              });
            } else if (
              err.response.data.message ===
              "category is not allowed to be empty"
            ) {
              this.setState({
                errorMessage: { category: "Category is required." }
              });
            } else if (
              err.response.data.message === "address is not allowed to be empty"
            ) {
              this.setState({
                errorMessage: { address: "Address is required." }
              });
            } else if (
              err.response.data.message ===
              "event_date must be a number of milliseconds or valid date string"
            ) {
              this.setState({
                errorMessage: { date: "Date is required." }
              });
            }
          });
      }
    });
  };
  componentDidMount() {
    this.getPermissionAsync();
    const { navigation } = this.props;
    const event = navigation.getParam("event");
    this.setState({
      eventId: event._id,
      title: event.title,
      description: event.description,
      details: event.details,
      address: event.address,
      category: event.category[0],
      date: event.event_date,
      oldImage: event.image,
      dateButtonTittle: moment(event.date).format("dddd, MMMM Do YYYY, h:mm a")
    });
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
          <View style={{ flex: 1, marginTop: 10 }}>
            <Input
              placeholder="Event tittle. "
              labelStyle={{ marginTop: 5, color: "#009688" }}
              label="Title:"
              onChangeText={Title => this.setState({ title: Title })}
              value={this.state.title}
              errorMessage={this.state.errorMessage.title}
            />
            <Input
              placeholder="Event description. "
              labelStyle={{ marginTop: 5, color: "#009688" }}
              label="Description:"
              onChangeText={Description =>
                this.setState({ description: Description })
              }
              value={this.state.description}
              errorMessage={this.state.errorMessage.description}
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
              Details:
            </Text>
            <TextInput
              placeholder="Event details."
              multiline={true}
              style={{
                height: 100,
                borderColor: "gray",
                borderWidth: 1,
                textAlignVertical: "top",
                padding: 5,
                marginTop: 15,
                marginBottom: 10,
                marginLeft: 10,
                marginRight: 10,
                fontSize: 17
              }}
              onChangeText={Details => this.setState({ details: Details })}
              value={this.state.details}
            />
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                marginTop: 10
              }}
            >
              {this.state.errorMessage.details}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#009688",
                marginLeft: 10,
                marginTop: 10
              }}
            >
              Category:
            </Text>
            <Picker
              mode={"dialog"}
              selectedValue={this.state.category}
              style={{ height: 50, width: "100%" }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ category: itemValue })
              }
            >
              <Picker.Item label="Select a category" value="" />
              <Picker.Item label="Tech" value="Tech" />
              <Picker.Item label="Learning" value="Learning" />
              <Picker.Item label="Sport & Fitness" value="Sport & Fitness" />
              <Picker.Item label="Health" value="Health" />
              <Picker.Item
                label="Language & culture"
                value="Language & culture"
              />
              <Picker.Item label="Music" value="Music" />
              <Picker.Item label="Film" value="Film" />
            </Picker>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                marginTop: 10
              }}
            >
              {this.state.errorMessage.category}
            </Text>
            <Input
              labelStyle={{ marginTop: 5, color: "#009688" }}
              label="Address:"
              placeholder="State, City"
              onChangeText={Address => this.setState({ address: Address })}
              value={this.state.address}
              errorMessage={this.state.errorMessage.address}
            />
            <Spinner
              visible={this.state.spinner}
              textContent={"Updating event ..."}
              textStyle={{ color: "#FFF" }}
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
              Date:
            </Text>
            <Button
              type="clear"
              title={this.state.dateButtonTittle}
              onPress={this.showDateTimePicker}
              titleStyle={{ color: "gray" }}
            />
            <DateTimePicker
              minimumDate={new Date()}
              mode={"datetime"}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                marginTop: 10
              }}
            >
              {this.state.errorMessage.date}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#009688",
                marginLeft: 10,
                marginTop: 10
              }}
            >
              Image:
            </Text>

            <Button
              type="clear"
              title="Click here to select image "
              onPress={this._pickImage}
              titleStyle={{ color: "gray" }}
            />

            {this.state.showOldImage && (
              <Image
                containerStyle={{ alignSelf: "center" }}
                source={{
                  uri: "http://80.211.10.131:3000/" + this.state.oldImage
                }}
                style={{ width: 200, height: 200 }}
              />
            )}
            {this.state.showNewImage && (
              <Image
                containerStyle={{ alignSelf: "center" }}
                source={{ uri: this.state.image }}
                style={{ width: 200, height: 200 }}
              />
            )}

            <Text
              style={{
                color: "red",
                marginLeft: 10,
                marginTop: 10
              }}
            >
              {this.state.errorMessage.image}
            </Text>
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
              title="Confirm"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default EditEvent;
