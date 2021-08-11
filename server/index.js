const express = require('express');
require('dotenv').config({ path: '../.env' });
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const Spotify = require('./spotify');
const cryptoRandomString = require('crypto-random-string');
const { db, updateUser, User, userConverter } = require('./firebase');
const serviceAccount = require(process.env.FIRESTORE_SERVICE_ACCOUNT)
const connect = require('connect');
const FirebaseStore = require('connect-session-firebase')(session);
const admin = require('firebase-admin');

const app = express();

const ref = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIRESTORE_DATABASE_URL
});

app.use(
    session({
        store: new FirebaseStore({
            database: ref.database()
        }),
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static('public'));
app.use(cookieParser()); // Change to session

app.get('/get-user', (req, res) => {
    if (!req.session.user) return null;
    else {
        res.send(req.session.user);
    };
})

app.get('/authorize', (req, res) => {
    scopes = [
        'user-read-recently-played', 
        'user-top-read', 
        'playlist-modify-public', 
        'user-read-currently-playing', 
        'user-library-modify', 
        'user-read-email'
    ]

    const state = req.session.state || cryptoRandomString(20);
    req.session.state = state;
    const authorizeURL = Spotify.createAuthorizeURL(scopes, state);
    res.redirect(authorizeURL + '&show_dialog=true');
});

app.get('/spotify-callback', async (req, res) => {
    const { code } = req.query;
    const data = await Spotify.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    Spotify.setAccessToken(access_token);
    Spotify.setRefreshToken(refresh_token);

    Spotify.getMe()
        .then(userResults => {
            const uid = userResults.body.id;
            const username = userResults.body.display_name;
            const email = userResults.body.email;
            const prof_pic = userResults.body.images;
            const today = new Date();
            const user = new User(
                access_token,
                bio = '',
                date_joined = today,
                display_name = username, 
                email,
                last_online = today,
                prof_pic,  
                uid, 
                username
            );
            req.session.user = user;
            updateUser(user);
            res.redirect('/')
        })
        .catch(error => console.log(error));
    }
)

app.get('/get-user-posts', (req, res) => {
    let userPosts;
    db.collection('posts').onSnapshot(snapshot => (
        userPosts = snapshot.docs.map(doc => doc.data())
    ))
    res.send(userPosts);
})

app.listen(5000, () => {
    console.log('server started on port 5000');
});