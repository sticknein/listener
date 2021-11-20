const express = require('express');
require('dotenv').config({ path: '../.env' });
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const cryptoRandomString = require('crypto-random-string');
const FirebaseStore = require('connect-session-firebase')(session);
const admin = require('firebase-admin');
const cookieParser = require('cookie-parser');

const { 
    Comment,
    createUser,
    db, 
    editUser,
    getPostComments,
    getUser,
    getUserPosts,
    likePost,
    Post,
    sendComment,
    sendPost,
    storage,
    unlikePost,
    uploadAvatar, 
    User, 
    userConverter,
    userExists
} = require('./firebase');
const serviceAccount = require(process.env.FIRESTORE_SERVICE_ACCOUNT)

const Spotify = require('./spotify');

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
app.use(cookieParser());

const SIX_MONTHS = 15778800000;

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
                has_account = false,
                last_online = today,
                username
            );

            req.session.user = user;

            getUser(user.email).then(response => {
                if (response !== null) {
                    user.avatar = response.avatar;
                    user.bio = response.bio;
                    user.date_joined = response.date_joined;
                    user.has_account = true;
                    user.username = response.username;

                    res.redirect('http://localhost:3000/')
                } else {
                    // res.cookie('user', JSON.stringify(user), { maxAge: SIX_MONTHS, httpOnly: true });

                    createUser(req.session.user)
                    res.redirect('http://localhost:3000/edit-account');
                }
            })
        })
        .catch(error => console.log(error));
    }
);

// ENDPOINTS

app.get('/check-user', (req, res) => {
    userExists(req.session.user, response => {
        res.send(response);
    });
});

app.post('/create-account', upload.single('file'), (req, res) => {
    let user = {
        access_token: req.body.access_token,
        avatar: '',
        bio: req.body.bio,
        date_joined: new Date(),
        display_name: req.body.display_name,
        email: req.body.email,
        last_online: new Date(),
        username: req.body.username
    }

    return createUser(user)
        .then(() => {

            uploadAvatar(req.file, req.session.user.username, response => {
                    let avatar = response;

                    let user = {
                        access_token: req.body.access_token,
                        avatar: avatar,
                        bio: req.body.bio,
                        display_name: req.body.display_name,
                        email: req.body.email,
                        username: req.body.username
                    }

                    req.session.user.avatar = user.avatar;

                    updateUser(user)
                        .then(() => {
                            res.send(user)
                        }).catch(error => console.log(error));
        })
    })
});

app.post('/edit-user', (req, res) => {
    editUser(req.body)
    req.session.user = req.body;
    res.send(req.session.user)
});

app.get('/get-post-comments', (req, res) => {
    getPostComments(req.query.username, req.query.id, response => {
        res.send(response);
    })
});

app.get('/get-user', (req, res) => {
    if (!req.session.user) {
        res.json(null);
    }
    else {
        getUser(req.session.user.email)
            .then(response => {
                if (response !== null) {
                    response.exists = true;
                }
                req.session.user = response;
                res.json(req.session.user);
            })
            .catch(error => console.log(error));
    }
});

app.get('/get-user-posts', (req, res) => {
    getUserPosts(req.session.user, postsArray => {
        res.send(postsArray);
    });
    
});

app.post('/like-post', (req, res) => {
    likePost(req.body.post_id, req.body.email);
});

app.post('/send-comment', (req, res) => {
    const comment = new Comment(
        req.body.post_id, 
        req.body.username, 
        req.body.text
    )

    sendComment(comment);
})

app.post('/send-post', (req, res) => {
    const post = new Post(
        req.session.user,
        req.body.text,
        req.body.link
    );
    
    sendPost(post);
})

app.post('/unlike-post', (req, res) => {
    unlikePost(req.body.post_id, req.body.email);
})

app.post('/upload-avatar', upload.single('file'), (req, res) => { 
    uploadAvatar(req.file, req.session.user.email, req.session.user.username, response => {
        const url = response;
        res.json(url);
    })
});

app.listen(5000, () => {
    console.log('server started on port 5000');
});