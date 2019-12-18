import React, { Component } from "react";
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
  createMaterialTopTabNavigator,
  createDrawerNavigator,
  DrawerActions
} from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

import Login from "../screens/login";
import Register from "../screens/register";
import Loading from "../screens/loading";
import AuthHome from "../screens/authhome";
import DetailsAuth from "../screens/authdetails";
import MyEvents from "../screens/myevent";
import MySubscription from "../screens/mysubscription";
import HomeGuest from "../screens/home";
import DetailsGuest from "../screens/details";
import NewEvent from "../screens/newEvent";
import EditEvent from "../screens/editEvent";
import Profile from "../screens/profile";
import EditProfile from "../screens/editprofile";
import GuestSidebarMenu from "../components/guestSidebarMenu";
import AuthSidebarMenu from "../components/authSidebarMenu";

const loginStack = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    Register: {
      screen: Register
    }
  },
  {
    initialRouteName: "Login"
  }
);
const profileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ({ navigation }) => ({
        title: "Profile",
        headerStyle: {
          backgroundColor: "#009688",
          shadowOpacity: 0,
          elevation: 0
        },
        headerLeft: (
          <Ionicons
            name="md-menu"
            color="#fff"
            size={32}
            style={{ marginLeft: 15 }}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      })
    },
    EditProfile: {
      screen: EditProfile,
      navigationOptions: ({ navigation }) => ({
        title: "Edit Profile",
        headerStyle: {
          backgroundColor: "#009688",
          shadowOpacity: 0,
          elevation: 0
        },

        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      })
    }
  },
  {
    initialRouteName: "Profile"
  }
);

const TabNavigator = createMaterialTopTabNavigator(
  {
    Home: {
      screen: AuthHome,
      navigationOptions: () => ({
        title: "All"
      })
    },
    MyEvents: {
      screen: MyEvents,
      navigationOptions: () => ({
        title: "My Events"
      })
    },
    MySubscription: {
      screen: MySubscription,
      navigationOptions: () => ({
        title: "Going"
      })
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "white",
      inactiveTintColor: "white",
      style: {
        backgroundColor: "#009688"
      }
    }
  }
);

const authStack = createStackNavigator(
  {
    Home: {
      screen: TabNavigator,
      navigationOptions: ({ navigation }) => ({
        title: "Events",
        headerStyle: {
          backgroundColor: "#009688",
          shadowOpacity: 0,
          elevation: 0
        },
        headerLeft: (
          <Ionicons
            name="md-menu"
            color="#fff"
            size={32}
            style={{ marginLeft: 15 }}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      })
    },
    Details: {
      screen: DetailsAuth,
      navigationOptions: () => ({
        headerStyle: {
          backgroundColor: "#009688",
          shadowOpacity: 0,
          elevation: 0
        },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      })
    },
    NewEvent: {
      screen: NewEvent,
      navigationOptions: () => ({
        headerStyle: {
          backgroundColor: "#009688",
          shadowOpacity: 0,
          elevation: 0
        },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      })
    },
    EditEvent: {
      screen: EditEvent,
      navigationOptions: () => ({
        headerStyle: {
          backgroundColor: "#009688",
          shadowOpacity: 0,
          elevation: 0
        },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      })
    }
  },
  {
    initialRouteName: "Home"
  }
);
const authDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: authStack
    },
    Profile: {
      screen: profileStack
    }
  },
  {
    contentComponent: AuthSidebarMenu
  }
);
const guestStack = createStackNavigator(
  {
    Home: {
      screen: HomeGuest,
      navigationOptions: ({ navigation }) => ({
        title: "Events",
        headerStyle: {
          backgroundColor: "#009688",
          shadowOpacity: 0,
          elevation: 0
        },
        headerLeft: (
          <Ionicons
            name="md-menu"
            color="#fff"
            size={32}
            style={{ marginLeft: 15 }}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      })
    },
    Details: {
      screen: DetailsGuest,
      navigationOptions: () => ({
        headerStyle: {
          backgroundColor: "#009688",
          shadowOpacity: 0,
          elevation: 0
        },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      })
    }
  },
  {
    initialRouteName: "Home"
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: guestStack
    }
  },
  {
    contentComponent: GuestSidebarMenu
  }
);

const appContainer = createSwitchNavigator(
  { loginStack, Loading, Auth: authDrawerNavigator, Guest: DrawerNavigator },
  {
    initialRouteName: "Loading"
  }
);

const Root = createAppContainer(appContainer);

export default Root;
