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
// const { nextTick } = require('process');

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

// SPOTIFY AUTH

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

            getUser(user.username).then(response => {
                let exists = response;
                if (exists) {
                    user.avatar = response.avatar;
                    user.bio = response.bio;
                    user.date_joined = response.date_joined;
                    user.email = response.email;
                    user.username = response.username;


                    res.redirect('http://localhost:3000/')
                } else {
                    res.redirect('http://localhost:3000/account-setup');
                }
            })
        })
        .catch(error => console.log(error));
    }
);

// GET

app.get('/check-user', (req, res) => {
    return userExists(req.session.user, response => {
        return res.send(response);
    });
})

app.get('/get-user', (req, res) => {
    if (!req.session.user) {
        return res.json(null); 
    }
    else {
        return res.json(req.session.user); 
    }
})

app.get('/get-user-posts', (req, res) => {
    return getUserPosts(req.session.user, response => {
        return res.send(response);
    });
    
})

// POST

app.post('/create-account', (req, res) => {
    createUser(req.body)
    req.session.user = req.body;
    res.send(req.body)
})

app.post('/send-post', (req, res) => {
    return sendPost(req.session.user, req.body.text, req.body.link, response => {
        return res.send(response)
    });
});

app.post('/upload-avatar', upload.single('file'), (req, res) => { 
    return uploadAvatar(req.file, req.session.user.username, response => {
        const url = response;
        res.json(url);
    })
})

app.listen(5000, () => {
    console.log('server started on port 5000');
});