const firebase = require('firebase');
const fs = require('fs');
require('firebase/storage');
require('dotenv').config({ path: '../.env' });

const serviceAccount = require('./service-account.json')

// Firebase db setup
const firebaseApp = firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
});

const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

// Class constructors
class User {
    constructor (access_token, avatar, bio, date_joined, display_name, email, has_account, last_online, username) {
        this.access_token = access_token;
        this.avatar = avatar;
        this.bio = bio;
        this.date_joined = date_joined;
        this.display_name = display_name;
        this.email = email;
        this.has_account = has_account;
        this.last_online = last_online;
        this.username = username;
    }
    object() {
        return User;
    }
}

class Post {
    constructor (username, text, link) {
        this.comments = [];
        this.liked = false;
        this.likes = 0;
        this.link = link;
        this.text = text;
        this.timestamp = new Date();
        this.username = username;
    }
    object() {
        return Post;
    }
};

// Firestore data converters

const postConverter = {
    toFirestore: post => {
        return {
            comments: post.comments,
            liked: post.likes,
            likes: post.likes,
            link: post.link,
            text: post.text,
            timestamp: post.timestamp,
            username: post.username
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Post(
            data.comments,
            data.liked,
            data.likes,
            data.link,
            data.text,
            data.timestamp,
            data.username
        );
    }
};

const userConverter = {
    toFirestore: user => {
        return {
            access_token: user.access_token,
            avatar: user.avatar,
            bio: user.bio,
            date_joined: user.date_joined,
            display_name: user.display_name,
            email: user.email,
            has_account: user.has_account,
            last_online: user.last_online,
            username: user.username
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(
            data.access_token, 
            data.avatar,
            data.bio, 
            data.date_joined, 
            data.display_name, 
            data.email, 
            data.has_account,
            data.last_online, 
            data.username
        );
    }
};

// db query methods

const createUser = user => {
    return db.collection('users').doc(user.email)
        .withConverter(userConverter)
        .set(user)
};

const editUser = user => {
    return db.collection('users').doc(user.email)
        .withConverter(userConverter)
        .set(user)
};

const getPostComments = (username, id, callback) => {
    db.collection('users').doc(username).collection('posts').doc(id).collection('comments').get()
        .then(comments => {
            let commentArray = comments.docs.map(doc => {
                let comment = doc.data();
                const id = doc.id;
                comment = { id, ...comment };
                return comment;
            });
            commentArray.sort((x, y) => {
                return new Date(y.timestamp) - new Date(x.timestamp);
            });
            callback(commentArray)
        })
        .catch(error => console.log(error));
}

const getUser = email => {
    return db.collection('users').doc(email)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return doc.data()
                }
                else {
                    return null;
                }
            })
            .catch(error => console.log(error));
}

const getUserPosts = (user, callback) => {
    db.collection('posts').get()
        .then(posts => {
            let userPosts = posts.docs.map(doc => {
                let post = doc.data();
                const id = doc.id;
                post = { id, ...post }
                return post;
            });
            userPosts.sort((x, y) => {
                return new Date(y.timestamp) - new Date(x.timestamp);
            })
            callback(userPosts)
        })
        .catch(error => console.log(error));
};

// const likePost = (id, username) => {
//     db.collection('users').doc(username).collection('posts').doc(id).update({
//         liked: true,
//         liked_by: username,
//         likes: firebase.firestore.FieldValue.increment(1)
//     })
// };

// const sendComment = (id, username, comment, callback) => {
//     db.collection('users').doc(username).collection('posts').doc(id).collection('comments').add({
//         liked: false,
//         liked_by: [],
//         likes: 0,
//         text: comment,
//         timestamp: new Date().toString()
//     })
//     .then(comment => {
//         callback(comment);
//     })
// }

const sendPost = post => {
    db.collection('posts').doc()
        .withConverter(postConverter)
        .set(post)
}

// const sendPost = (username, text, link, callback) => {
//     db.collection('users').doc().collection('posts').add({
//         liked: false,
//         liked_by: [],
//         likes: 0,
//         link: link,  
//         text: text, 
//         timestamp: new Date().toString(),
//         user: username
//     })
//     .then(post => {
//         callback(post);
//     })
// };

// const unlikePost = (id, username) => {
//     db.collection('users').doc(username).collection('posts').doc(id).update({
//         liked: false,
//         liked_by: firebase.firestore.FieldValue.arrayRemove(username),
//         likes: firebase.firestore.FieldValue.increment(-1)
//     })
// }

// const userExists = (email, callback) => {
//     return db.collection('users').doc(email)
//         .get().then(doc => {
//             let exists = doc.exists;
//             callback(exists)
//             return exists;
//         })
// };

const uploadAvatar = (file, email, username, callback) => {
    let fileType = file.mimetype.replace('image/', '');
    const avatarImagesRef = storageRef.child(`images/${email}/${username}-avatar.${fileType}`);

    fs.readFile(file.path, (error, data) => {
        avatarImagesRef.put(data).then(snapshot => {
            console.log('File uploaded!');
        })
        .then(() => {
            return avatarImagesRef.getDownloadURL()
            .then(link => {
                const url = link;
                callback(url)
                return url;
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    });
};

module.exports = { 
    createUser,
    db,
    editUser,
    getPostComments,
    getUser,
    getUserPosts,
    // likePost,
    Post,
    // sendComment,
    sendPost,
    // unlikePost,
    uploadAvatar,
    User,
    userConverter
}