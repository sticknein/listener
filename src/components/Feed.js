import React, { useEffect, useState } from 'react';
import './Feed.css';
import PostBox from './PostBox';
import Post from './Post';
import FlipMove from 'react-flip-move';

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // db.collection('posts').onSnapshot(snapshot => (
        //     setPosts(snapshot.docs.map(doc => doc.data()))
        // ))
    }, []);

    return (
        <div className='feed'>
            <div className='feed_header'>
                <h2>Home</h2>  
            </div>
            
            <PostBox />

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
