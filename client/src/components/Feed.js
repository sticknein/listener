import React, { useEffect, useState } from 'react';
import './Feed.css';
import PostBox from './PostBox';
import Post from './Post';
import FlipMove from 'react-flip-move';

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/get-user-posts')
            .then(posts => posts.json())
            .then(jsonPosts => setPosts(jsonPosts))
    }, []);

    return (
        <div className='feed'>
            <div className='feed-header'>
                <h2>Welcome to listener, {props.user.display_name}.</h2>  
            </div>
            
            <PostBox user={props.user}/>

            <FlipMove>
                {posts.map(post => (
                    <Post  
                        key={post.id}
                        displayName={post.displayName}
                        username={post.username}
                        artist={post.artist}
                        text={post.text}
                        avatar={post.avatar}
                        link={post.link}
                        timestamp={post.timestamp}
                    /> 
                ))}    
            </FlipMove>
        </div>
    )
}

export default Feed;
