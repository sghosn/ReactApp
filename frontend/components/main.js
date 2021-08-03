import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../redux/actions/index'
import { createDrawerNavigator } from '@react-navigation/drawer';

import FeedScreen from './main/Feed'
import AddScreen from './main/Add'
import ProfileScreen from './main/Profile'
import NotificationScreen from './main/Notification'
import SearchScreen from './main/Search'
import firebase from 'firebase';

const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

const EmptyScreen = () => {
    return(null)
}

export class main extends Component {
    componentDidMount(){
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }
    render() {
        return (
        <Tab.Navigator intialRoutename="Feed" labeled={false}>
            <Tab.Screen name="Feed" component={FeedScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26}/>
                    ),
                }}/>
            <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={26}/>
                    ),
                }}/>
             <Tab.Screen name="AddContainer" component={EmptyScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Add")
                    }
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                    ),
                    }}/>
             <Tab.Screen name="Profile" component={ProfileScreen} 
                listeners={({ navigation }) => ({
                        tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", {uid:firebase.auth().currentUser.uid})
            
                     }})}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                    ),
                }}/>
            <Tab.Screen name="Notifications" component={NotificationScreen} 
                listeners={({ navigation }) => ({
                        tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Notifications", {uid:firebase.auth().currentUser.uid})
            
                     }})}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={26}/>
                    ),
                }}/>
        </Tab.Navigator>

        )
        
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser

})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(main);
