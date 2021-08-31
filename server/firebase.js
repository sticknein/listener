const firebase = require('firebase');
require('firebase/storage');
require('dotenv').config({ path: '../.env' });

const serviceAccount = require('./service-account.json')

// Firebase db setup
firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,

});

const db = firebase.firestore();
const storage = firebase.storage();

// User object
class User {
    constructor (access_token, avatar, bio, date_joined, display_name, email, last_online, prof_pic, username) {
        this.access_token = access_token;
        this.avatar = avatar;
        this.bio = bio;
        this.date_joined = date_joined;
        this.display_name = display_name;
        this.email = email;
        this.last_online = last_online;
        this.username = username;
    }
    object() {
        return User;
    }
}

// Firestore data converter
const userConverter = {
    toFirestore: user => {
        return {
            access_token: user.access_token,
            avatar: user.avatar,
            bio: user.bio,
            date_joined: user.date_joined,
            display_name: user.display_name,
            email: user.email,
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
            data.last_online, 
            data.username
        );
    }
};

// Avatar storage
function uploadAvatar(image) {
    const storageRef = storage.ref();
    const imageRef = storageRef.child(image.name);
    imageRef.put(image)
        .then(() => {
            alert('Image uploaded successfully to Firebase.');
        })
        .catch(error => console.log(error));
}

// Query methods
function userExists(user) {
    db.collection('users').doc(user.username)
        .get().then(doc => {
            if (doc.exists) return true;
            else return false;
        })
}

function createUser(user) {
    db.collection('users').doc(user.username)
        .withConverter(userConverter)
        .set(user);
    console.log(`Created user: ${user.username}`);
}

function updateUser(user) {
    db.collection('users').doc(user.username)
        .withConverter(userConverter)
        .update({
            access_token: user.access_token,
            bio: user.bio,
            display_name: user.display_name,
            email: user.email,
            last_online: user.last_online,
            prof_pic: user.prof_pic,
        });
    
    console.log(`Updated user: ${user.username}`);
};



function sendPost(user, postText, postLink) {
    db.collection('users').doc(user.username).collection('posts').add({
        display_name: user.display_name, 
        username: user.username,  
        text: postText, 
        link: postLink, 
        avatar: user.prof_pic, 
        timestamp: new Date().toString()
    })
}

function getUserPosts(user, callback) {
    db.collection('users').doc(user.username).collection('posts').onSnapshot(snapshot => {
        let userPosts = snapshot.docs.map(doc => doc.data());
        callback(userPosts)  
        return userPosts;
    })
}

module.exports = { 
    createUser,
    db,
    getUserPosts,
    sendPost,
    updateUser,
    uploadAvatar,
    User,
    userConverter,
    userExists
}