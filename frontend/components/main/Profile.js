import React, {useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Image, Button, FlatList, StatusBar, Dimensions, SafeAreaView, Animated, PanResponder, Platform, TouchableOpacity, Alert, Statusbar, ActivityIndicator, } from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view';
import Constants from 'expo-constants'
import { connect } from 'react-redux'
import firebase from 'firebase';
require('firebase/firestore')

const TabBarHeight = 48;
const HeaderHeight = 300;
const tab1ItemSize = (Dimensions.get('window').width - 30) / 2;
const tab2ItemSize = (Dimensions.get('window').width - 40) / 3;

function Profile(props) {

    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);

    const fetchData = () => {
      const { currentUser, posts } = props;

      if(props.route.params.uid === firebase.auth().currentUser.uid){
          setUser(currentUser)
          setUserPosts(posts)
      } else {
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
          .doc(props.route.params.uid)
          .collection("userPosts")
          .orderBy("captioncreation", "asc")
          .get()
          .then((snapshot) => {
              let posts = snapshot.docs.map(doc => {
                  const data = doc.data();
                  const id = doc.id;
                  return { id, ...data }
              })
              setUserPosts(posts)
          })
      }

      if(props.following.indexOf(props.route.params.uid) > -1)
          {
              setFollowing(true);

          } else {
              setFollowing(false);
          }
    }
    const fetchRefreshData = () => {
      console.log("test");
      const { currentUser, posts } = props;
          setLoading(true)
          console.log("Test")
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
          .doc(props.route.params.uid)
          .collection("userPosts")
          .orderBy("captioncreation", "asc")
          .get()
          .then((snapshot) => {
              let posts = snapshot.docs.map(doc => {
                  const data = doc.data();
                  const id = doc.id;
                  return { id, ...data }
              })
              setUserPosts(posts)
          })
      

      if(props.following.indexOf(props.route.params.uid) > -1)
          {
              setFollowing(true);

          } else {
              setFollowing(false);
          }
          setLoading(false)
    }

    useEffect(() => {
      if (loading === true && refresh === false) {
        fetchData()
      } else {
        setRefresh(true)
        fetchRefreshData()
      }
      setRefresh(true)
      setLoading(false)
    }, [routes, tabIndex, props.route.params.uid, props.following])

    const TabScene = ({
        numCols,
        data,
        renderItem,
        onGetRef,
        scrollY,
        onScrollEndDrag,
        onMomentumScrollEnd,
        onMomentumScrollBegin,
      }) => {
        const windowHeight = Dimensions.get('window').height;
      
        return (
          <Animated.FlatList
            scrollToOverflowEnabled={true}
            numColumns={numCols}
            ref={onGetRef}
            scrollEventThrottle={16}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
            useNativeDriver: true })}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListHeaderComponent={() => <View style={{height: 10}} />}
            contentContainerStyle={{
              paddingTop: HeaderHeight + TabBarHeight,
              paddingHorizontal: 10,
              minHeight: windowHeight - TabBarHeight,
            }}
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            refreshing={loading}
            onRefresh={()=>fetchRefreshData()}
          />
        );
      };
      

    const onFollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})
    }
    const onUnFollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }

        const [tabIndex, setIndex] = useState(0);
        const [routes] = useState([
          {key: 'tab1', title: 'Tab1'},
          {key: 'tab2', title: 'Tab2'},
        ]);
        const [tab2Data] = useState(Array(30).fill(0));
        const scrollY = useRef(new Animated.Value(0)).current;
        let listRefArr = useRef([]);
        let listOffset = useRef({});
        let isListGliding = useRef(false);
      
        useEffect(() => {
          scrollY.addListener(({value}) => {
            const curRoute = routes[tabIndex].key;
            listOffset.current[curRoute] = value;
          });
          return () => {
            scrollY.removeAllListeners();
          };
        }, [routes, tabIndex]);
      
        const syncScrollOffset = () => {
          const curRouteKey = routes[tabIndex].key;
          listRefArr.current.forEach((item) => {
            if (item.key !== curRouteKey) {
              if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
                if (item.value) {
                  item.value.scrollToOffset({
                    offset: scrollY._value,
                    animated: false,
                  });
                  listOffset.current[item.key] = scrollY._value;
                }
              } else if (scrollY._value >= HeaderHeight) {
                if (
                  listOffset.current[item.key] < HeaderHeight ||
                  listOffset.current[item.key] == null
                ) {
                  if (item.value) {
                    item.value.scrollToOffset({
                      offset: HeaderHeight,
                      animated: false,
                    });
                    listOffset.current[item.key] = HeaderHeight;
                  }
                }
              }
            }
          });
        };
      
        const onMomentumScrollBegin = () => {
          isListGliding.current = true;
        };
      
        const onMomentumScrollEnd = () => {
          isListGliding.current = false;
          syncScrollOffset();
        };
      
        const onScrollEndDrag = () => {
          syncScrollOffset();
        };
      
        const renderHeader = () => {
          const y = scrollY.interpolate({
            inputRange: [0, HeaderHeight],
            outputRange: [0, -HeaderHeight],
            extrapolateRight: 'clamp',
          });
          return (
            <Animated.View style={[styles.header, {transform: [{translateY: y}]}]}>
              <View>
              <Image
                                style={styles.profileImage}
                                source={{ uri: user.profilePic }}
                            />
              </View>
              <View style={styles.container}>
                <Text>{user.email}</Text>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View style={styles.buttonContainer}> 
                        {following ? (
                            <Button
                                title="Following"
                                onPress={()=> onUnFollow()}   
                        />
                        ) :
                        (
                            <Button
                                title="Follow"
                                onPress={()=> onFollow()}   
                            />
                        )}
                    </View>
                ) : 
                  <View style={styles.buttonContainer}>
                    <Button
                        title="Logout"
                        onPress={()=> onLogout()}
                    />
                    <Button
                        title="Change Profile Pic"
                        onPress={() => props.navigation.navigate('Test' , { screen: 'Settings' })}
                    />
                  </View>}
              </View>
            </Animated.View>
          );

        };
      
        const rednerTab1Item = ({item}) => {
          return (
            <View
            style={styles.containerImage}>
            <Image
                style={styles.image}
                source={{ uri: item.downloadURL }}
            />
        </View>
              /* 
            <View style={styles.containerGallery}>
                
                 <FlatList 
                    numColumns={0}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>
                    )}

                />
            </View>
                                  */

            );
        };
      
        const rednerTab2Item = ({item, index}) => {
          return (
            <View
              style={{
                marginLeft: index % 3 === 0 ? 0 : 10,
                borderRadius: 16,
                width: tab2ItemSize,
                height: tab2ItemSize,
                backgroundColor: '#aaa',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{index}</Text>
            </View>
          );
        };
      
        const renderLabel = ({route, focused}) => {
          return (
            <Text style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
              {route.title}
            </Text>
          );
        };
      
        const renderScene = ({route}) => {
          const focused = route.key === routes[tabIndex].key;
          let numCols;
          let data;
          let renderItem;
          switch (route.key) {
            case 'tab1':
              numCols = 0;
              data = userPosts;
              renderItem = rednerTab1Item;
              break;
            case 'tab2':
              numCols = 3;
              data = tab2Data;
              renderItem = rednerTab2Item;
              break;
            default:
              return null;
          }
          return (
            <TabScene
              numCols={numCols}
              data={data}
              renderItem={renderItem}
              scrollY={scrollY}
              onMomentumScrollBegin={onMomentumScrollBegin}
              onScrollEndDrag={onScrollEndDrag}
              onMomentumScrollEnd={onMomentumScrollEnd}
              onGetRef={(ref) => {
                if (ref) {
                  const found = listRefArr.current.find((e) => e.key === route.key);
                  if (!found) {
                    listRefArr.current.push({
                      key: route.key,
                      value: ref,
                    });
                  }
                }
              }}
            />
          );
        };
      
        const renderTabBar = (props) => {
          const y = scrollY.interpolate({
            inputRange: [0, HeaderHeight],
            outputRange: [HeaderHeight, 0],
            extrapolateRight: 'clamp',
          });
          return (
            <Animated.View
              style={{
                top: 0,
                zIndex: 1,
                position: 'absolute',
                transform: [{translateY: y}],
                width: '100%',
              }}>
              <TabBar
                {...props}
                onTabPress={({route, preventDefault}) => {
                  if (isListGliding.current) {
                    preventDefault();
                  }
                }}
                style={styles.tab}
                renderLabel={renderLabel}
                indicatorStyle={styles.indicator}
              />
            </Animated.View>
          );
        };
      
        const renderTabView = () => {
          return (
            <TabView
              onIndexChange={(index) => setIndex(index)}
              navigationState={{index: tabIndex, routes}}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              initialLayout={{
                height: 0,
                width: Dimensions.get('window').width,
              }}
            />
          );
        };
      
        
    if(user === null) {
        return <View/>
    }
    
    return (
            <View style={{flex: 1}}>
              {renderTabView()}
              {renderHeader()}

            </View>
          );
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.email}</Text>
                <Text>{user.email}</Text>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View> 
                        {following ? (
                            <Button
                                title="Following"
                                onPress={()=> onUnFollow()}   
                        />
                        ) :
                        (
                            <Button
                                title="Follow"
                                onPress={()=> onFollow()}   
                            />
                        )}
                    </View>
                ) :  
                    <Button
                        title="Logout"
                        onPress={()=> onLogout()}   
                    />}
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>
                    )}

                />
            </View>
        </View>

}

const styles = StyleSheet.create({
      profileImage: {
        height:150,
        width:150,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
        flex: 1,
        marginBottom: 50
        
    },
    container: {
      marginTop: -90
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    buttonContainer: {
      marginBottom: 40
    },
    header: {
        top: 0,
        height: HeaderHeight,
        width: '100%',
        backgroundColor: '#40C4FF',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
      },
      label: {fontSize: 16, color: '#222'},
      tab: {elevation: 0, shadowOpacity: 0, backgroundColor: '#FFCC80'},
      indicator: {backgroundColor: '#222'},
})


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);

/*
const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const TabBarHeight = 48;
const HeaderHeight = 250;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});
const tab1ItemSize = (windowWidth - 30) / 2;
const tab2ItemSize = (windowWidth - 40) / 3;
const PullToRefreshDist = 150;

function Profile(props)  {
  /**
   * stats
   
  
   const [userPosts, setUserPosts] = useState([]);
   const [user, setUser] = useState(null);
   const [following, setFollowing] = useState(false);

  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'tab1', title: 'Tab1'},
    {key: 'tab2', title: 'Tab2'},
  ]);
  const [canScroll, setCanScroll] = useState(true);
  const [tab2Data] = useState(Array(30).fill(0));

  /**
   * ref
   
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  // for capturing header scroll on Android
  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);
  const refreshStatusRef = useRef(false);

  /**
   * PanResponder for header
   
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        syncScrollOffset();
        return false;
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderEnd: (evt, gestureState) => {
        handlePanReleaseOrEnd(evt, gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        const curListRef = listRefArr.current.find(
          (ref) => ref.key === routes[_tabIndex.current].key,
        );
        const headerScrollOffset = -gestureState.dy + headerScrollStart.current;
        if (curListRef.value) {
          // scroll up
          if (headerScrollOffset > 0) {
            curListRef.value.scrollToOffset({
              offset: headerScrollOffset,
              animated: false,
            });
            // start pull down
          } else {
            if (Platform.OS === 'ios') {
              curListRef.value.scrollToOffset({
                offset: headerScrollOffset / 3,
                animated: false,
              });
            } else if (Platform.OS === 'android') {
              if (!refreshStatusRef.current) {
                headerMoveScrollY.setValue(headerScrollOffset / 1.5);
              }
            }
          }
        }
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollStart.current = scrollY._value;
      },
    }),
  ).current;

  /**
   * PanResponder for list in tab scene
   
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return false;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation();
      },
    }),
  ).current;

  /**
   * effect
   
  useEffect(() => {
    const { currentUser, posts } = props;

      if(props.route.params.uid === firebase.auth().currentUser.uid){
          setUser(currentUser)
          setUserPosts(posts)
      } else {
          console.log("Testing")
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
          .doc(props.route.params.uid)
          .collection("userPosts")
          .orderBy("captioncreation", "asc")
          .get()
          .then((snapshot) => {
              let posts = snapshot.docs.map(doc => {
                  const data = doc.data();
                  const id = doc.id;
                  return { id, ...data }
              })
              setUserPosts(posts)
          })
      }

      if(props.following.indexOf(props.route.params.uid) > -1)
          {
              setFollowing(true);

          } else {
              setFollowing(false);
          }
    scrollY.addListener(({value}) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });

    headerScrollY.addListener(({value}) => {
      listRefArr.current.forEach((item) => {
        if (item.key !== routes[tabIndex].key) {
          return;
        }
        if (value > HeaderHeight || value < 0) {
          headerScrollY.stopAnimation();
          syncScrollOffset();
        }
        if (item.value && value <= HeaderHeight) {
          item.value.scrollToOffset({
            offset: value,
            animated: false,
          });
        }
      });
    });
    return () => {
      scrollY.removeAllListeners();
      headerScrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  /**
   *  helper functions
   
  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex.current].key;

    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              });
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };

  const startRefreshAction = () => {
    if (Platform.OS === 'ios') {
      listRefArr.current.forEach((listRef) => {
        listRef.value.scrollToOffset({
          offset: -50,
          animated: true,
        });
      });
      refresh().finally(() => {
        syncScrollOffset();
        // do not bounce back if user scroll to another position
        if (scrollY._value < 0) {
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      });
    } else if (Platform.OS === 'android') {
      Animated.timing(headerMoveScrollY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
      refresh().finally(() => {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePanReleaseOrEnd = (evt, gestureState) => {
    // console.log('handlePanReleaseOrEnd', scrollY._value);
    syncScrollOffset();
    headerScrollY.setValue(scrollY._value);
    if (Platform.OS === 'ios') {
      if (scrollY._value < 0) {
        if (scrollY._value < -PullToRefreshDist && !refreshStatusRef.current) {
          startRefreshAction();
        } else {
          // should bounce back
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      } else {
        if (Math.abs(gestureState.vy) < 0.2) {
          return;
        }
        Animated.decay(headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          syncScrollOffset();
        });
      }
    } else if (Platform.OS === 'android') {
      if (
        headerMoveScrollY._value < 0 &&
        headerMoveScrollY._value / 1.5 < -PullToRefreshDist
      ) {
        startRefreshAction();
      } else {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
    // console.log('onMomentumScrollEnd'); 
  };

  const onScrollEndDrag = (e) => {
    syncScrollOffset();

    const offsetY = e.nativeEvent.contentOffset.y;
    // console.log('onScrollEndDrag', offsetY);
    // iOS only
    if (Platform.OS === 'ios') {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }

    // check pull to refresh
  };
  const fetchData = () => {
    console.log("test")
    const { currentUser, posts } = props;

    if(props.route.params.uid === firebase.auth().currentUser.uid){
        setUser(currentUser)
        setUserPosts(posts)
    } else {
        console.log("Testing")
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
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("captioncreation", "asc")
        .get()
        .then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            setUserPosts(posts)
        })
    }

    if(props.following.indexOf(props.route.params.uid) > -1)
        {
            setFollowing(true);

        } else {
            setFollowing(false);
        }
  }

  useEffect(() => {
    fetchData()
  }, [routes, tabIndex, props.route.params.uid, props.following])

  const refresh = () => {
    console.log('-- start refresh');
    refreshStatusRef.current = true;
    refreshStatusRef.current = false;
  };

  /**
   * render Helper
   
   if (user === null) {
    return <View />
}

  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight],
      extrapolateRight: 'clamp',
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={[styles.header, {transform: [{translateY: y}]}]}>
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.email}</Text>
                <Text>{user.email}</Text>
          {props.route.params.uid !== firebase.auth().currentUser.uid ? (
        <View> 
        {following ? (
            <Button
                title="Following"
                onPress={()=> onUnFollow()}   
        />
        ) :
        (
            <Button
                title="Follow"
                onPress={()=> onFollow()}   
            />
        )}
    </View>
) : 
  <View>
    <Button
        title="Logout"
        onPress={()=> onLogout()}
    />
    <Button
        title="Change Profile Pic"
        onPress={()=> onLogout()}
    />
  </View>}
  </View>
  </View>
      </Animated.View>
    );
  };

  const rednerTab1Item = ({item, index}) => {
    return (
      <View
            style={styles.containerImage}>
            <Image
                style={styles.image}
                source={{ uri: item.downloadURL }}
            />
      </View>
      <View style={styles.containerGallery}>
                
      <FlatList 
         numColumns={0}
         horizontal={false}
         data={userPosts}
         renderItem={({ item }) => (
             <View
                 style={styles.containerImage}>
                 <Image
                     style={styles.image}
                     source={{ uri: item.downloadURL }}
                 />
             </View>
         )}
     />
 </View>
    );
  };

  const rednerTab2Item = ({item, index}) => {
    return (
      <View
        style={{
          marginLeft: index % 3 === 0 ? 0 : 10,
          borderRadius: 16,
          width: tab2ItemSize,
          height: tab2ItemSize,
          backgroundColor: '#aaa',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>{index}</Text>
      </View>
    );
  };

  const renderLabel = ({route, focused}) => {
    return (
      <Text style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
        {route.title}
      </Text>
    );
  };

  const renderScene = ({route}) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    switch (route.key) {
      case 'tab1':
        numCols = 0;
        data = userPosts;
        renderItem = rednerTab1Item;
        break;
      case 'tab2':
        numCols = 3;
        data = tab2Data;
        renderItem = rednerTab2Item;
        break;
      default:
        return null;
    }
    return (
      <Animated.FlatList
        scrollToOverflowEnabled={true}
        // scrollEnabled={canScroll}
        {...listPanResponder.panHandlers}
        numColumns={numCols}
        ref={(ref) => {
          if (ref) {
            const found = listRefArr.current.find((e) => e.key === route.key);
            if (!found) {
              listRefArr.current.push({
                key: route.key,
                value: ref,
              });
            }
          }
        }}
        scrollEventThrottle={16}
        onScroll={
          focused
            ? Animated.event(
                [
                  {
                    nativeEvent: {contentOffset: {y: scrollY}},
                  },
                ],
                {useNativeDriver: true},
              )
            : null
        }
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        contentContainerStyle={{
          paddingTop: HeaderHeight + TabBarHeight,
          paddingHorizontal: 10,
          minHeight: windowHeight - SafeStatusBar + HeaderHeight,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 0],
      // extrapolate: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: 'absolute',
          transform: [{translateY: y}],
          width: '100%',
        }}>
        <TabBar
          {...props}
          onTabPress={({route, preventDefault}) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
        />
      </Animated.View>
    );
  };

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
        }}
        navigationState={{index: tabIndex, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: windowWidth,
        }}
      />
    );
  };

  const renderCustomRefresh = () => {
    // headerMoveScrollY
    return Platform.select({
      ios: (
        <AnimatedIndicator
          style={{
            top: -50,
            position: 'absolute',
            alignSelf: 'center',
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [120, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}
          animating
        />
      ),
      android: (
        <Animated.View
          style={{
            transform: [
              {
                translateY: headerMoveScrollY.interpolate({
                  inputRange: [-300, 0],
                  outputRange: [150, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
            backgroundColor: '#eee',
            height: 38,
            width: 38,
            borderRadius: 19,
            borderWidth: 2,
            borderColor: '#ddd',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            top: -50,
            position: 'absolute',
          }}>
          <ActivityIndicator animating />
        </Animated.View>
      ),
    });
  };

  return (
    <View style={styles.container}>
      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
      margin: 20
  },
  containerGallery: {
      flex: 1
  },
  containerImage: {
      flex: 1/3
  },
  image: {
      flex: 1,
      aspectRatio: 1/1
  },
  header: {
    height: HeaderHeight,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#FFA088',
  },
  label: {fontSize: 16, color: '#222'},
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#FFCC80',
    height: TabBarHeight,
  },
  indicator: {backgroundColor: '#222'},
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);
*/