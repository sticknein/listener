import React, { useEffect, useState } from 'react';

import './PlaybackFeed.css';

import UserPlayback from './UserPlayback';

import FlipMove from 'react-flip-move';

function PlaybackFeed(props) {
    const [playbackFeed, setPlaybackFeed] = useState(null);

    useEffect(() => {
        fetch('/now-playing')
            .then(response => {
                return response.json()
            })
            .then(playback => {
                if (playback) {
                    setPlaybackFeed(playback);    
                }
                
            })
            .catch(error => console.log(error));
    }, []);
    
    return (
        <div className='playback-feed-container'>
            <h2>Now Playing</h2>
            <br/>
                    {playbackFeed &&
                        <FlipMove>
                            <div className='playback-feed'>
                                {playbackFeed.map(user_playback => (
                                    <div className='user-playback'>
                                        <UserPlayback user_playback={user_playback}/>
                                    </div>
                                ))}
                            </div>
                        </FlipMove>
                    }
            <br/>
        </div>
    )
}

export default PlaybackFeed;
