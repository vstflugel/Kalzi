import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavigationSvg from './src/components/navigationSvg';
import { Colors } from './src/components/colors';
// import SplashScreen from "react-native-splash-screen";

import homeScreen from './src/screens/homeStack/home';
import trainerProfile from './src/screens/homeStack/trainerProfile';
import chatScreen from './src/screens/chat';
import noChatScreen from './src/screens/noChat';
import profileScreen from './src/screens/profile';
import viewParticipants from './src/screens/viewParticipants';
import LoadAuth from './src/screens/loadAuth';
import login from './src/screens/login';
import signUp from './src/screens/signUp';
import multipleChat from './src/screens/multipleChat';
import viewHealth from './src/screens/viewHealth';
import register from './src/screens/register';
import WebViewScreen from './src/screens/webView'
import weightLog from './src/screens/weightLog';
import weightScreen from './src/screens/weightLog';



import auth from '@react-native-firebase/auth'

import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux'
import { connect } from 'react-redux'

const HomeStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator()
const AuthStack = createNativeStackNavigator()
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

var subscriber

// function AuthStackScreen() {
//   return (
//     <AuthStack.Navigator screenOptions={{ headerShown: false }}>
//       <AuthStack.Screen name="Login" component={login} />
//       <AuthStack.Screen name="SignUp" component={signUp} />
//     </AuthStack.Navigator>
//   )
// }

// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator screenOptions={{ headerShown: false }}>
//       <HomeStack.Screen name="Sessions" component={homeScreen} initialParams={{ registered: false }} />
//       <HomeStack.Screen name="TrainerProfile" component={trainerProfile} />
//       <HomeStack.Screen name="ViewParticipants" component={viewParticipants} />
//       <HomeStack.Screen name="ViewHealth" component={viewHealth} />
//       <HomeStack.Screen name="WebView" component={WebViewScreen} />
//     </HomeStack.Navigator>
//   );
// }

// function ChatStackScreen() {
//   return (
//     <ChatStack.Navigator screenOptions={{ headerShown: false }}>
//       <ChatStack.Screen name="MultipleChat" component={multipleChat} />
//       <ChatStack.Screen name="Chat" component={chatScreen} />
//     </ChatStack.Navigator>
//   )
// }

// function ChatStackNoScreen() {
//   return (
//     <ChatStack.Navigator screenOptions={{ headerShown: false }}>
//       <ChatStack.Screen name="NoChat" component={noChatScreen} />
//     </ChatStack.Navigator>
//   )
// }

// function ChatStackOneScreen() {
//   return (
//     <ChatStack.Navigator screenOptions={{ headerShown: false }}>
//       <ChatStack.Screen name="Chat" component={chatScreen} />
//     </ChatStack.Navigator>
//   )
// }

// const Tab = createBottomTabNavigator();

// function TabStackScreen() {
//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={{ headerShown: false }}
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = focused ? 'homeSelected' : 'home';
//           } else if (route.name === 'Profile') {
//             iconName = focused ? 'profileSelected' : 'profile';
//           } else if (route.name === 'Chat') {
//             iconName = focused ? 'chatSelected' : 'chat';
//           }

//           return <NavigationSvg name={iconName} />;
//         },
//       })}
//       tabBarOptions={{
//         style: {
//           backgroundColor: Colors.tabNavigator,
//           height: 65,
//           borderTopWidth: 0,
//           paddingTop: 10,
//           paddingBottom: 10,
//         },
//         activeTintColor: Colors.gradientLeft,
//         inactiveTintColor: Colors.textPlaceholder,
//         keyboardHidesTabBar: true,
//       }}
//     >
//       {props.user.user.sessions.length === 0 && <Tab.Screen name="Chat" component={ChatStackNoScreen} />}
//       {props.user.user.sessions.length === 1 && !props.user.user.isTrainer && <Tab.Screen name="Chat" component={ChatStackOneScreen} options={{ tabBarBadge: props.user.unread > 0 ? props.user.unread : null, tabBarBadgeStyle: { backgroundColor: Colors.gradientRight } }} />}
//       {(props.user.user.isTrainer || props.user.user.sessions.length > 1) && <Tab.Screen name="Chat" component={ChatStackScreen} options={{ tabBarBadge: props.user.unread > 0 ? props.user.unread : null, tabBarBadgeStyle: { backgroundColor: Colors.gradientRight } }} />}
//       <Tab.Screen name="Home" component={HomeStackScreen} />
//       <Tab.Screen name="Profile" component={profileScreen} />
//     </Tab.Navigator>
//   )
// }

export default function App() {

  return (
    <Provider store={store} >
      <PersistGate persistor={persistor} >
        <ConnectedIntermediateComponent />
      </PersistGate>
    </Provider>

  )
  
}

class Intermediate extends Component {

  constructor(props) {
    super(props)
    this.state = {

      user: 0,
      signUpDone: false

    }
  }

  onAuthStateChanged = (user) => {
    this.setState({ user: user })
    // this.setState({ user: 1 })
  }

  async componentDidMount() {
    subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  componentWillUnmount() {
    subscriber()
  }

  AuthStackScreen = () => {
    return ( 
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={login} />
        <AuthStack.Screen name="SignUp" component={signUp} />
        
      </AuthStack.Navigator>
    )
  }
  
  HomeStackScreen = () => {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Sessions" component={homeScreen} initialParams={{ registered: false }} />
        <HomeStack.Screen name="TrainerProfile" component={trainerProfile} />
        <HomeStack.Screen name="ViewParticipants" component={viewParticipants} />
        <HomeStack.Screen name="ViewHealth" component={viewHealth} />
        <HomeStack.Screen name="WebView" component={WebViewScreen} />
        <AuthStack.Screen name="weightLog" component={weightLog} />
        
      </HomeStack.Navigator>
    );
  }
  
  ChatStackScreen = () => {
    return (
      <ChatStack.Navigator screenOptions={{ headerShown: false }}>
        <ChatStack.Screen name="MultipleChat" component={multipleChat} />
        <ChatStack.Screen name="ChatHome" component={chatScreen} />
      </ChatStack.Navigator>
    )
  }
  
  ChatStackNoScreen = () => {
    return (
      <ChatStack.Navigator screenOptions={{ headerShown: false }}>
        <ChatStack.Screen name="ChatNone" component={noChatScreen} />
      </ChatStack.Navigator>
    )
  }
  
  ChatStackOneScreen = () => {
    return (
      <ChatStack.Navigator screenOptions={{ headerShown: false, }}>
        <ChatStack.Screen name="ChatHome" component={chatScreen} />
      </ChatStack.Navigator>
    )
  }
  
  
  TabStackScreen = () => {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            if (route.name === 'Home') {
              iconName = focused ? 'homeSelected' : 'home';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'profileSelected' : 'profile';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatSelected' : 'chat';
            }
  
            return <NavigationSvg name={iconName} />;
          },
        })}
        tabBarOptions={{
          style: {
            backgroundColor: Colors.tabNavigator,
            height: 65,
            borderTopWidth: 0,
            paddingTop: 10,
            paddingBottom: 10,
          },
          activeTintColor: Colors.gradientLeft,
          inactiveTintColor: Colors.textPlaceholder,
          keyboardHidesTabBar: true,
        }}
      >
        {this.props.user.user.sessions.length === 0 && <Tab.Screen name="Chat" component={this.ChatStackNoScreen}  />}
        {this.props.user.user.sessions.length === 1 && !this.props.user.user.isTrainer && <Tab.Screen name="Chat" component={this.ChatStackOneScreen} options={{ tabBarBadge: this.props.user.unread > 0 ? this.props.user.unread : null, tabBarBadgeStyle: { backgroundColor: Colors.gradientRight } }} />}
        {(this.props.user.user.isTrainer || this.props.user.user.sessions.length > 1) && <Tab.Screen name="Chat" component={this.ChatStackScreen} options={{ tabBarBadge: this.props.user.unread > 0 ? this.props.user.unread : null, tabBarBadgeStyle: { backgroundColor: Colors.gradientRight } }} />}
        <Tab.Screen name="Home" component={this.HomeStackScreen} />
        <Tab.Screen name="Profile" component={profileScreen} />
        
      </Tab.Navigator>
    )
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          {this.state.user === 0 ? (<Stack.Screen name="Loading" component={LoadAuth} />)
            : this.state.user === null ? (<Stack.Screen name="Auth" component={this.AuthStackScreen} />)
              : !this.props.user.signUp ? (<Stack.Screen name="Register" component={register} />)
                : (<Stack.Screen name="HomeNav" component={this.TabStackScreen} />)
          }
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  // render() {

  //   if (this.state.user === 0) {

  //     return <LoadAuth />

  //   }

  //   return (

  //     <NavigationContainer>
  //       {this.state.user !== 0 && this.state.user !== null && this.props.user.signUp &&

  //         <Tab.Navigator
  //           initialRouteName="Home"
  //           screenOptions={{ headerShown: false }}
  //           screenOptions={({ route }) => ({
  //             tabBarIcon: ({ focused, color, size }) => {
  //               let iconName;

  //               if (route.name === 'Home') {
  //                 iconName = focused ? 'homeSelected' : 'home';
  //               } else if (route.name === 'Profile') {
  //                 iconName = focused ? 'profileSelected' : 'profile';
  //               } else if (route.name === 'Chat') {
  //                 iconName = focused ? 'chatSelected' : 'chat';
  //               }

  //               return <NavigationSvg name={iconName} />;
  //             },
  //           })}
  //           tabBarOptions={{
  //             style: {
  //               backgroundColor: Colors.tabNavigator,
  //               height: 65,
  //               borderTopWidth: 0,
  //               paddingTop: 10,
  //               paddingBottom: 10,
  //               // position: 'absolute'
  //             },
  //             activeTintColor: Colors.gradientLeft,
  //             inactiveTintColor: Colors.textPlaceholder,
  //             keyboardHidesTabBar: true,
  //           }}
  //         >
  //           {this.props.user.user.sessions.length === 0 && <Tab.Screen name="Chat" component={ChatStackNoScreen}/>}
  //           {this.props.user.user.sessions.length === 1 && !this.props.user.user.isTrainer && <Tab.Screen name="Chat" component={ChatStackOneScreen} options={{tabBarBadge: this.props.user.unread > 0 ? this.props.user.unread : null , tabBarBadgeStyle: {backgroundColor: Colors.gradientRight}}} />}
  //           {(this.props.user.user.isTrainer || this.props.user.user.sessions.length > 1 ) && <Tab.Screen name="Chat" component={ChatStackScreen} options={{tabBarBadge: this.props.user.unread > 0 ? this.props.user.unread : null , tabBarBadgeStyle: {backgroundColor: Colors.gradientRight} }} />}
  //           <Tab.Screen name="Home" component={HomeStackScreen} />
  //           <Tab.Screen name="Profile" component={profileScreen} />
  //         </Tab.Navigator>

  //       }
  //       {this.state.user !== 0 && this.state.user !== null && !this.props.user.signUp &&

  //         <RegisterStack.Navigator screenOptions={{ headerShown: false }}>
  //           <RegisterStack.Screen name="Register" component={register} />
  //         </RegisterStack.Navigator>

  //       }
  //       {this.state.user === 0 || this.state.user === null &&

  //         <AuthStack.Navigator screenOptions={{ headerShown: false }}>
  //           {/* <AuthStack.Screen name="LoadAuth" component={loadAuth} /> */}
  //           <AuthStack.Screen name="Login" component={login} />
  //           <AuthStack.Screen name="SignUp" component={signUp} />
  //         </AuthStack.Navigator>

  //       }
  //     </NavigationContainer>
  //   );
  // }

}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

const ConnectedIntermediateComponent = connect(mapStateToProps)(Intermediate)
