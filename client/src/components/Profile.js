import React, { useState, useEffect } from 'react';
import './Profile.css';
import cover_photo from '../placeholder_data/cover_photo.jpeg';
import FlipMove from 'react-flip-move';
import Post from './Post';


function Profile(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/get-user-posts')
            .then(posts => posts.json())
            .then(jsonPosts => setPosts(jsonPosts))
    }, []);

    return (
        <div className='profile'>
            <div className='header-photo'>
                <img src={cover_photo} id='cover-photo' alt='Cover photo'/> {/* add cover photo input in AccountSetup.js */}
            </div>
            <div className='sub-header'>
                <div id='prof-pic-row'>
                    <img src={props.user.avatar} id='prof-pic' alt='Profile picture' />
                </div>
                <div id='name-row'>
                    <h1>Holophone</h1>
                    <h2>@holophone</h2>
                    <p className='bio'>{props.user.bio}</p>
                </div>
            </div>

            <hr />

            <FlipMove>
                {posts.map(post => (
                    <Post 
                        //key={post.} PULL POST ID FROM FIREBASE, create auto incr? use other method? 
                        avatar={post.avatar}
                        display_name={post.display_name}
                        link={post.link}
                        text={post.text}
                        timestamp={post.timestamp}
                        username={post.username}
                    /> 
                ))}    
            </FlipMove>

        </div>
    )
}

export default Profile;