const firebase = require('firebase');

// Firebase db setup
firebase.initializeApp({
    apiKey: 'AIzaSyB8aNPEYWb1EVBY0-2Sar28-WcrdwyVYOk',
    authDomain: "listener-c93f7.firebaseapp.com",
    databaseURL: "https://listener-c93f7-default-rtdb.firebaseio.com",
    projectId: "listener-c93f7",
    storageBucket: "listener-c93f7.appspot.com",
    messagingSenderId: "141730301284",
    appId: "1:141730301284:web:23c4515d2fabcf0f046671",
    measurementId: "G-CQ8FLKSN9D"
});

const db = firebase.firestore();

// User object
class User {
    constructor (access_token, bio, date_joined, display_name, email, last_online, prof_pic, uid, username) {
        this.access_token = access_token;
        this.bio = bio;
        this.date_joined = date_joined;
        this.display_name = display_name;
        this.email = email;
        this.last_online = last_online;
        this.prof_pic = prof_pic;
        this.uid = uid;
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
            bio: user.bio,
            date_joined: user.date_joined,
            display_name: user.display_name,
            email: user.email,
            last_online: user.last_online,
            prof_pic: user.prof_pic,
            uid: user.uid,
            username: user.username
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(
            data.access_token, 
            data.bio, 
            data.date_joined, 
            data.display_name, 
            data.email, 
            data.last_online, 
            data.prof_pic, 
            data.uid, 
            data.username
        );
    }
};

// Query methods
function updateUser(user) {
    db.collection('users').doc(user.uid)
        .withConverter(userConverter)
        .set(user);
    
    console.log(`Updated user: ${user.uid}`);
};

module.exports = { 
    db,
    updateUser,
    User,
    userConverter
}