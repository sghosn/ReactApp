import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions'

function Notification(props) {
    const [userNotifications, setUserNotifications] = useState([]);
    const [user, setUser] = useState(null);

    const { currentUser, notifications } = props;
    useEffect(() => { 
        if(props.route.params.uid === firebase.auth().currentUser.uid){
            console.log("Test1")
            setUser(currentUser)
            setUserNotifications(notifications)
        } else {
            console.log("Test2")
            firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    setUser(snapshot.data())
                }
                else {
                    console.log('does not exist')
                }
            })
            firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("notifications")
            .get()
            .onSnapshot((snapshot) => {
            let notifications = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                    return { id, ...data }
                })
                setUserNotifications(notifications)
            })
        }
    })
    
    return (
        <View>
        <FlatList
            data={userNotifications}
            renderItem={({ item }) => (
                    <View>
                        <Text>{item.activity}</Text>
                    </View>
                )}
        />
        </View>
    )
}  
/*    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {

        function matchUserToComment(comments){
            for(let i = 0; i < comments.length; i++) {

                if(comments[i].hasOwnProperty('user')){
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator)
                if(user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }


        if(props.route.params.postId !== postId) {
            firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .get()
            .then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                matchUserToComment(comments)
            })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }

    }, [props.route.params.postId, props.user])

    const onCommentSend = () => {
        firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .add({
            creator: firebase.auth().currentUser.uid,
            text
        })
    }

    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {item.user !== undefined ?
                        <Text>
                            {item.user.name}
                        </Text>
                    : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users

})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Notification);
*/
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    notifications: store.userState.notifications,
})

export default connect(mapStateToProps, null)(Notification);
