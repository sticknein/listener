const express = require('express');
require('dotenv').config({ path: '../.env' });
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cryptoRandomString = require('crypto-random-string');
const FirebaseStore = require('connect-session-firebase')(session);
const admin = require('firebase-admin');

const { 
    createUser,
    db, 
    getUserPosts,
    sendPost,
    storage,
    updateUser,
    uploadAvatar, 
    User, 
    userConverter,
    userExists 
} = require('./firebase');
const serviceAccount = require(process.env.FIRESTORE_SERVICE_ACCOUNT)

const Spotify = require('./spotify');

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
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// GET

app.get('/get-user', (req, res) => {
    if (!req.session.user) {
        res.json(null);
    }
    else {
        res.send(req.session.user);
    };
})

app.get('/check-user', (req, res) => {
    if (req.session.user && userExists(req.session.user)) res.send(true);
    else res.send(false);
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
    const authorizeURL = Spotify.createAuthorizeURL(scopes, state) + '&show_dialog=true';
    res.json(authorizeURL)
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
            if (userExists(user)) {
                updateUser(user);
                res.redirect('http://localhost:3000/')
            } else {
                res.redirect('http://localhost:3000/account-setup')
            }
        })
        .catch(error => console.log(error));
    }
)

app.get('/get-user-posts', (req, res) => {
    getUserPosts(req.session.user, userPosts => res.send(userPosts));
})

// POST

app.post('/post', (req, res) => {
    sendPost(req.session.user, req.body.postText, req.body.postLink)
})

app.post('/upload-avatar', (req, res) => {
    console.log(req.body)
    // uploadAvatar(something.something);
})

app.post('/create-account', (req, res) => {
    createUser(req.session.user);
})

app.listen(5000, () => {
    console.log('server started on port 5000');
});