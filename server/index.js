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
    deleteComment,
    deletePost,
    editUser,
    emailPasswordLogin,
    getAllUsers,
    getPostComments,
    getPosts,
    getUser,
    getUserPosts,
    likeComment,
    likePost,
    Post,
    sendComment,
    sendPost,
    storage,
    unlikeComment,
    unlikePost,
    uploadAvatar, 
    User, 
    userConverter,
    userExists,
} = require('./firebase');

const {
    nowPlaying,
    Spotify
} = require('./spotify')

const serviceAccount = require(process.env.FIRESTORE_SERVICE_ACCOUNT)

const app = express();
const upload = multer({ dest: 'uploads/' });

const ref = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIRESTORE_DATABASE_URL
});

const SIX_MONTHS = 15778800000;
const ONE_HOUR = 60 * 60 * 1000;

app.use(
    session({
        store: new FirebaseStore({
            database: ref.database()
        }),
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: false,
        expires: new Date(Date.now() + SIX_MONTHS)
    })
);

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// SPOTIFY AUTH

app.get('/authorize', (req, res) => {
    scopes = [
        'user-read-recently-played', 
        'user-top-read', 
        'playlist-modify-public', 
        'user-read-currently-playing', 
        'user-read-playback-state',
        'user-library-modify', 
        'user-read-email'
    ]

    const state = req.session.state || cryptoRandomString(20);
    req.session.state = state;
    const authorizeURL = Spotify.createAuthorizeURL(scopes, state) + '&show_dialog=true';
    res.json(authorizeURL)
});

app.get('/spotify-callback', (req, res) => {
    const { code } = req.query;

    Spotify.authorizationCodeGrant(code)
        .then(data => {
            const { access_token, refresh_token } = data.body;

            Spotify.setAccessToken(access_token);
            Spotify.setRefreshToken(refresh_token);

            let tokens = {
                access_token: access_token,
                refresh_token: refresh_token,
                expires_in: new Date().getTime() + ONE_HOUR
            }

            Spotify.getMe()
                .then(userResults => {
                    const username = userResults.body.display_name;
                    const email = userResults.body.email;
                    const today = new Date();
                    
                    const user = new User(
                        avatar = '',
                        bio = '',
                        date_joined = today,
                        display_name = username, 
                        email,
                        password = '',
                        has_account = false,
                        last_online = today,
                        tokens,
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
                            createUser(req.session.user)
                            res.redirect('http://localhost:3000/edit-account');
                        }
                    })
                })
                .catch(error => console.log(error));
        }).catch(error => console.log(error));
    }
);

// ENDPOINTS

// app.get('/check-user', (req, res) => {
//     userExists(req.session.user, response => {
//         res.send(response);
//     });
// });

app.get('/check-user', (req, res) => {
    if (!req.session.user) {
        res.json(null);
    }
    else {
        getUser(req.session.user.email)
            .then(response => {
                if (response !== null) {
                    response.exists = true;
                }
                response.tokens = req.session.user.tokens;
                req.session.user = response;
                res.json(req.session.user);
            })
            .catch(error => console.log(error));
    }
});

app.post('/create-user', (req, res) => {
    let user = req.body;

    req.session.user = user;

    createUser(user)

    res.send('User created!')
})

app.post('/delete-comment', (req, res) => {
    deleteComment(req.body.comment_id, req.body.post_id);
    res.send(`Deleted comment ${req.body.comment_id}`);
});

app.post('/delete-post', (req, res) => {
    deletePost(req.body.post_id);
    res.send(`Deleted post ${req.body.post_id}`);
})

app.post('/edit-user', (req, res) => {
    editUser(req.body)
    req.session.user = req.body;
    res.send(req.session.user)
});

app.post('/email-password-login', (req, res) => {
    return emailPasswordLogin(req.body.email, req.body.password)
        .then(response => {
            res.send(response);
        })
})

app.post('/get-post-comments', (req, res) => {
    getPostComments(req.body.post_id)
        .then(comments => {
            res.send(comments);
        })
        .catch(error => console.log(error));
});

// app.get('/get-user', (req, res) => {
//     if (!req.session.user) {
//         res.json(null);
//     }
//     else {
//         getUser(req.session.user.email)
//             .then(response => {
//                 if (response !== null) {
//                     response.exists = true;
//                 }
//                 response.tokens = req.session.user.tokens;
//                 req.session.user = response;
//                 res.json(req.session.user);
//             })
//             .catch(error => console.log(error));
//     }
// });

app.post('/get-user', (req, res) => {
    return getUser(req.body.email)
        .then(response => {
            req.session.user = response;
            res.json(req.session.user);
        })
        .catch(error => console.log(error));
})

app.get('/get-posts', (req, res) => {
    getPosts()
        .then(posts => {
            res.send(posts);
        })
        .catch(error => console.log(error));
})

app.get('/get-user-posts', (req, res) => {
    getUserPosts(req.session.user)
        .then(posts => {
            res.send(posts)
        })
        .catch(error => console.log(error));
})

app.post('/like-comment', (req, res) => {
    likeComment(req.body.comment_id, req.body.email);
    res.send(`Liked comment ${req.body.comment_id}`);
});

app.post('/like-post', (req, res) => {
    likePost(req.body.post_id, req.body.email);
    res.send(`Liked post ${req.body_post_id}`);
});

app.post('/logout', (req, res) => {
    req.session.user = null;
    res.send('Logged out!');
});

app.get('/now-playing', (req, ers) => {
    const now = new Date().getTime();

    // PROMISE 1 getAllUsers()
    // PROMISE 2 checkAccessTokens()
    // PROMISE 3 getSpotifyPlayback()

    // don't forget res.json

    // const checkAccessTokens = async users => {
    //     const authorized_users = [];
    //     users.forEach(user => {
    //         if (Object.keys(user.tokens).length !== 0) {
    //             if (user.tokens.expires_in < now) {
    //                 Spotify.setRefreshToken(user.tokens.refresh_token);
    //                 Spotify.refreshAccessToken()
    //                     .then(data => {
    //                         user.tokens.access_token = data.body.access_token;
    //                         user.tokens.expires_in = (now + ONE_HOUR);
    //                         console.log(`User ${user.username} has a freshly minted access token.`);
    //                         Spotify.setAccessToken(data.body.access_token);
    //                         authorized_users.push(user);
    //                     })
    //                     .catch(error => console.log(error));
    //             }
    //         }
    //     })
    //     .then(() => {
    //         return authorized_users;
    //     })
    // }

    const checkAccessToken = async user => {
        if (Object.keys(user.tokens).length !== 0) {
            if (user.tokens.expires_in < now) {
                Spotify.setRefreshToken(user.tokens.refresh_token);
                await Spotify.refreshAccessToken()
                    .then(data => {
                        user.tokens.access_token = data.body.access_token;
                        user.tokens.expires_in = (now + ONE_HOUR);
                        console.log(`User ${user.username} has a freshly minted token.`);
                        Spotify.setAccessToken(data.body.access_token);
                        return user;
                    })
                    .catch(error => console.log(error));
            }
        }
    }

    // const getSpotifyPlayback = async users => {
    //     const playback_feed = [];

    //     users.forEach(user => {
    //         nowPlaying(user.tokens)
    //             .then(response => {
    //                 const playback = {
    //                     user: user,
    //                     playback: playback
    //                 };
    //                 playback_feed.push(playback);
    //             })
    //     })
    //     .then(() => {
    //         return playback_feed;
    //     });
    // };

    getAllUsers()
        .then(async users => {
            const authorized_users = [];
            for (let user of users) {
                if (Object.keys(user.tokens).length !== 0) {
                    const authorized_user = await checkAccessToken(user)
                    authorized_users.push(user)
                }
            }
            return authorized_users;
        })
        .then(async spotify_users => {
            const playback_feed = [];
            for (let user of spotify_users) {
                const playback = await nowPlaying(user.tokens);
                playback_feed.push(playback)
            }
            console.log('playback_feed', playback_feed)
            return playback_feed;
        })
        .catch(error => console.log(error));
});

app.post('/send-comment', (req, res) => {
    const comment = new Comment(
        req.body.post_id, 
        req.body.user, 
        req.body.text
    )

    sendComment(comment)
        .then(db_comment => {
            res.send(db_comment);
        })
        .catch(error => console.log(error));
})

app.post('/send-post', (req, res) => {
    const post = new Post(
        req.body.user,
        req.body.text,
        req.body.link
    );
    
    sendPost(post);
});

app.post('/set-user', (req, res) => {
    req.session.user = req.body;
    res.send('Set user')
})

app.post('/unlike-comment', (req, res) => {
    unlikeComment(req.body.comment_id, req.body.email);
    res.send(`Unliked comment ${req.body.comment_id}`);
});

app.post('/unlike-post', (req, res) => {
    unlikePost(req.body.post_id, req.body.email);
    res.send(`Unliked post ${req.body.post_id}`)
})

app.post('/upload-avatar', upload.single('file'), (req, res) => {
    console.log('index.js', 1)
    uploadAvatar(req.file, req.session.user.email, req.session.user.username)
        .then(url => {
            console.log('index.js', 2)
            console.log('index.js response', url)
            res.json(url);
        })
        .catch(error => console.log(error));
})

// app.post('/upload-avatar', upload.single('file'), (req, res) => { 
//     uploadAvatar(req.file, req.session.user.email, req.session.user.username, response => {
//         const url = response;
//         res.json(url);
//     })
// });

app.listen(5000, () => {
    console.log('server started on port 5000');
});