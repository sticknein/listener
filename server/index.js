const express = require('express');
require('dotenv').config({ path: '../.env' });
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const cryptoRandomString = require('crypto-random-string');
const FirebaseStore = require('connect-session-firebase')(session);
const admin = require('firebase-admin');

const { 
    createUser,
    db, 
    getUser,
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
// const { create } = require('domain');

const app = express();
const upload = multer({ dest: 'uploads/' });

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
            const username = userResults.body.display_name;
            const email = userResults.body.email;
            const prof_pic = userResults.body.images;
            const today = new Date();
            const user = new User(
                access_token,
                avatar = '',
                bio = '',
                date_joined = today,
                display_name = username, 
                email,
                last_online = today,
                username
            );
            req.session.user = user;

            let exists;

            getUser(user).then(response => {
                exists = response;
                if (exists) {
                    updateUser(user);
                    res.redirect('http://localhost:3000/')
                } else {
                    res.redirect('http://localhost:3000/account-setup');
                }
            })
        })
        .catch(error => console.log(error));
    }
);

app.get('/get-user', (req, res) => {
    if (!req.session.user) {
        return res.json(null); 
    }
    else {
        return res.json(req.session.user); 
    }
})

app.get('/check-user', (req, res) => {
    return userExists(req.session.user, response => {
        res.send(response);
    });
})

app.get('/get-user-posts', (req, res) => {
    getUserPosts(req.session.user, userPosts => res.send(userPosts));
    // res.dingus!
})

// POST

app.post('/post', (req, res) => {
    sendPost(req.session.user, req.body.postText, req.body.postLink)
    //ya gotta send something dingus!
})

app.post('/upload-avatar', upload.single('file'), (req, res) => { 
    uploadAvatar(req.file, req.session.user.username);
    res.send('Avatar uploaded to the server');
})

app.post('/create-account', (req, res) => {
    createUser(req.session.user)
    res.send(req.session.user)
})

app.listen(5000, () => {
    console.log('server started on port 5000');
});