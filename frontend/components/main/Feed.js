import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Image, Button, FlatList, StatusBar, Dimensions } from 'react-native'
import Constants from 'expo-constants'
import { connect } from 'react-redux'
import firebase from 'firebase';
require('firebase/firestore')

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let posts = [];
        console.log(props.following.length)
        if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){
            props.feed.sort(function(x,y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }

    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .set({
        })
        firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("notifications")
        .doc(firebase.auth().currentUser.uid)
        .set({
            activity: "liked",
            postIdIs: postId
        })
    }
    const onDisLikePress = (userId, postId) => {
        firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .delete()
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
            
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Text style={styles.container}>{item.downloadURL}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            { item.currentUserLike ? 
                                (
                                    <Button
                                        title="Dislike"
                                        onPress={() => onDisLikePress(item.user.uid, item.id)}/>
                                )
                                :
                                (
                                    <Button
                                        title="Like"
                                        onPress={() => onLikePress(item.user.uid, item.id)}/>
                                )
                            }
                            <Text
                                onPress={()=> props.navigation.navigate('Comment', 
                                { postId: item.id, uid: item.user.uid })
                            }>
                            View Comments...</Text>
                        </View>
                    )}

                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    containerInfo: {
        margin: 15
    },
    containerGallery: {
        flex: 1,

    },
    containerImage: {
        flex: 1,
        borderBottomColor: 'black',
        borderBottomWidth: 1.5,
        borderTopColor: 'black',
        borderTopWidth: 1.5
    },
    image: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        flex: 1,
        aspectRatio: 1/1
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed);
