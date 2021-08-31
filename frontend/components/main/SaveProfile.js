import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function SaveProfile(props, { navigation }) {
    const childPath = ` users/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
    console.log(childPath)

    const uploadImage = async () => {
        const uri = props.route.params.image;

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);
        
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
                profilePic: downloadURL,
            }).then((function() {
                props.navigation.popToTop()
            }))
    }
    return (
        <View style ={{flex: 1}}>
            <Image source={{uri: props.route.params.image}}/>
            <Button title="Save" onPress={() => uploadImage()}/>
        </View>
    )
}
