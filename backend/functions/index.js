const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.addLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
    .onCreate((snap, context) => {
        return db
            .collection('posts')
            .doc(context.params.creatorId)
            .collection('userPosts')
            .doc(context.params.postId)
            .update({
                    likesCount: admin.firestore.FieldValue.increment(1),
                    recentInteraction: admin.firestore.FieldValue.serverTimestamp()
            })
    })

exports.removeLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
    .onDelete((snap, context) => {
        return db
            .collection('posts')
            .doc(context.params.creatorId)
            .collection('userPosts')
            .doc(context.params.postId)
            .update({
                likesCount: admin.firestore.FieldValue.increment(-1)
            })
    })

    exports.testOne = functions.https.onRequest((req, res) => {
        return db
            .collection('posts')
            .doc(context.params.creatorId)
            .collection('userPosts')
            .doc(context.params.postId)
            .update({
                generaltest: admin.firestore.FieldValue.increment(1)
            })
    })
    /*
    exports.removeOldMessages = functions.https.onRequest((req, res) => {
        const timeNow = Date.now();
        const messagesRef = admin.database().ref('/posts/{creatorId}/userPosts');
        messagesRef.once('value', (snapshot) => {
            snapshot.forEach((child) => {
                if ((Number(child.val()['timestamp']) + Number(child.val()['duration'])) <= timeNow) {
                    child.ref.set(null);
                }
            });
        });
        return res.status(200).end();
    });
    */
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
