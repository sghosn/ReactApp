import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {Fragment} from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

/*
USE ENVIRONMENTAL VARIABLES TO HIDE IN THE FUTURE
*/
import { View, Text } from 'react-native'
import firebase from 'firebase'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyD6BkglJA3KJ4kRaiqCR9V-SSr1JXTUSKw",
  authDomain: "app-project-7328c.firebaseapp.com",
  projectId: "app-project-7328c",
  storageBucket: "app-project-7328c.appspot.com",
  messagingSenderId: "860281315244",
  appId: "1:860281315244:web:68f400bc9c83874330e409",
  measurementId: "G-6DY6W4MMSR"
};

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)

}

import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
import LandingScreen from './components/auth/Landing'
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/main'
import { createDrawerNavigator, DrawerActions } from '@react-navigation/drawer';

import FeedScreen from './components/main/Feed'
import ProfileScreen from './components/main/Profile'
import AddScreen from './components/main/Add'
import NotificationScreen from './components/main/Notification'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'


const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();
const MainStackNavigator = (navigation) => {
  return (
      <Stack.Navigator initialRouteName="Main" screenOptions={props => {
        const { toggleDrawer } = props.navigation
        return {
          headerLeft: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={26} size={30}
            style={{ flexDirection:"row", paddingLeft: 15 }}
            onPress={() => { toggleDrawer()}}/>
          )
        }
      }
      
      }>
      <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Add" component={AddScreen} navigation={navigation} />
        <Stack.Screen name="Save" component={SaveScreen} navigation={navigation}  />
        <Stack.Screen name="Comment" component={CommentScreen} navigation={navigation}  />
        <Stack.Screen name="Profile" component={ProfileScreen} navigation={navigation}  />
      </Stack.Navigator>
  )
}

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }
  

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded) {
      return(
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>

      )
    }

    if(!loggedIn){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Register" component={RegisterScreen}/>
              <Stack.Screen name="Login" component={LoginScreen}/>
            </Stack.Navigator>
            
        </NavigationContainer>
      );
   }
   return (
     <Provider store={store}>
       <NavigationContainer>
      <Drawer.Navigator initialRouteName="Main">
        <Drawer.Screen name="Main" component={MainStackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
     </Provider>
   )
  }
}

export default App
