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

class Comment {
    constructor(post_id, user, text) {
        this.comments = [];
        this.liked_by = [];
        this.post_id = post_id;
        this.text = text;
        this.timestamp = new Date().toString();
        this.user = user;
    }
    object() {
        return Comment;
    }
}

class Post {
    constructor (user, text, link) {
        this.comments = [];
        this.liked_by = [];
        this.link = link;
        this.text = text;
        this.timestamp = new Date().toString();
        this.user = user;
    }
    object() {
        return Post;
    }
};

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
};

// Firestore data converters

const commentConverter = {
    toFirestore: comment => {
        return {
            comments: comment.comments,
            liked_by: comment.liked_by,
            post_id: comment.post_id,
            text: comment.text,
            timestamp: comment.timestamp,
            user: comment.user
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Comment(
            data.comments,
            data.liked_by,
            data.post_id,
            data.text,
            data.timestamp,
            data.user
        )
    }
}

const postConverter = {
    toFirestore: post => {
        return {
            comments: post.comments,
            liked_by: post.liked_by,
            link: post.link,
            text: post.text,
            timestamp: post.timestamp,
            user: post.user
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Post(
            data.comments,
            data.liked_by,
            data.link,
            data.text,
            data.timestamp,
            data.user
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

const deleteComment = comment_id => {
    db.collection('comments').doc(comment_id).delete()
        .then(() => {
            return console.log(`Comment ${comment_id} deleted`)
        })
        .catch(error => console.log(error));
}

const deletePost = post_id => {
    db.collection('posts').doc(post_id).delete()
        .then(() => {
            return console.log(`Post ${post_id} deleted`)
        })
        .then(() => {
            const comments_query = db.collection('comments').where('post_id', '==', post_id);
            return comments_query.get()
                .then(comments => {
                    comments.forEach(doc => {
                        doc.ref.delete();
                    })
                })
        })
        .catch(error => {
            console.error('Error removing document: ', error);
        });
};

const editUser = user => {
    return db.collection('users').doc(user.email)
        .withConverter(userConverter)
        .set(user)
};

const getPostComments = (post_id, callback) => {
    db.collection('comments').where('post_id', '==', post_id)
        .get()
        .then(comments => {
            let commentsArray = comments.docs.map(doc => {
                let comment = doc.data();
                const comment_id = doc.id;
                comment = { comment_id, ...comment };
                return comment
            });
            commentsArray.sort((x, y) => {
                return new Date(y.timestamp) - new Date(x.timestamp);
            });
            callback(commentsArray)
        })
        .catch(error => console.log(error));
};

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
                const post_id = doc.id;
                post = { post_id, ...post }
                return post;
            });
            userPosts.sort((x, y) => {
                return new Date(y.timestamp) - new Date(x.timestamp);
            })
            callback(userPosts)
        })
        .catch(error => console.log(error));
};

const likeComment = (comment_id, email) => {
    db.collection('comments').doc(comment_id).update({
        liked_by: firebase.firestore.FieldValue.arrayUnion(email)
    });
};

const likePost = (post_id, email) => {
    db.collection('posts').doc(post_id).update({
        liked_by: firebase.firestore.FieldValue.arrayUnion(email)
    });
};

const sendComment = comment => {
    return db.collection('comments').doc()
        .withConverter(commentConverter)
        .set(comment)
        .then(() => {
           const comment_id = db.collection('comments').doc().id;
           db.collection('posts').doc(comment.post_id).update({
               comments: firebase.firestore.FieldValue.arrayUnion(comment_id)
           })
           comment = { comment_id, ...comment }; 
           return comment
        })
};

const sendPost = post => {
    db.collection('posts').doc()
        .withConverter(postConverter)
        .set(post);
};

const unlikeComment = (comment_id, email) => {
    db.collection('comments').doc(comment_id).update({
        liked_by: firebase.firestore.FieldValue.arrayRemove(email)
    });
};

const unlikePost = (post_id, email) => {
    db.collection('posts').doc(post_id).update({
        liked_by: firebase.firestore.FieldValue.arrayRemove(email)
    });
};

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
    Comment,
    commentConverter,
    createUser,
    db,
    deleteComment,
    deletePost,
    editUser,
    getPostComments,
    getUser,
    getUserPosts,
    likeComment,
    likePost,
    Post,
    sendComment,
    sendPost,
    unlikeComment,
    unlikePost,
    uploadAvatar,
    User,
    userConverter
}