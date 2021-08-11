import React, { useState, useEffect } from 'react';
import './Profile.css';
import cover_photo from '../placeholder_data/cover_photo.jpeg';
import logo from '../placeholder_data/prof_pic.jpg';
import FlipMove from 'react-flip-move';
import Post from './Post';


function Profile(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // call to endpoint, do db query there -- can I do listener/snapshot still this way?
        fetch('/get-user-posts')
            .then(posts => {
                setPosts(posts)
            })
    }, []);

    return (
        <div className='profile'>
            <div className='header-photo'>
                <img src={cover_photo} id='cover-photo' alt='Cover photo'/>
            </div>
            <div className='sub-header'>
                <div id='prof-pic-row'>
                    <img src={logo} id='prof-pic' alt='Profile picture' />
                </div>
                <div id='name-row'>
                    <h1>Holophone</h1>
                    <h2>@holophone</h2>
                    <p className='bio'>Keepin' it holophonic since 1990</p>
                </div>
            </div>

            <hr />

            <FlipMove>
                {posts.map(post => (
                    <Post 
                        //key={post.} PULL POST ID FROM FIREBASE, create auto incr? use other method? 
                        key={post.text}
                        displayName={post.displayName}
                        username={post.username}
                        artist={post.artist}
                        text={post.text}
                        avatar={post.avatar}
                        link={post.link}
                    /> 
                ))}    
            </FlipMove>

        </div>
    )
}

export default Profile;