import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../redux/actions/index'

import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from './auth/Landing'
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './auth/Register'
import LoginScreen from './auth/Login'
import MainScreen from './main'
import { createDrawerNavigator } from '@react-navigation/drawer';

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import AddScreen from './main/Add'
import NotificationScreen from './main/Notification'
import SaveScreen from './main/Save'
import CommentScreen from './main/Comment'

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStackNavigator = (navigate) => {
    return (
        <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Add" component={AddScreen} navigation={navigate} />
          <Stack.Screen name="Save" component={SaveScreen} navigation={navigate}  />
          <Stack.Screen name="Comment" component={CommentScreen} navigation={navigate}  />
          <Stack.Screen name="Profile" component={ProfileScreen} navigation={navigate}  />
        </Stack.Navigator>
    )
}

const DrawerNavigator = (navigate) => {
    return (
    <Drawer.Navigator>
        <Drawer.Screen name="Home"  />
    </Drawer.Navigator>
    )
}

export { MainStackNavigator, DrawerNavigator };

