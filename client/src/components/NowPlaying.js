import React, { useEffect, useState } from 'react';

import './NowPlaying.css';

import { Avatar } from '@material-ui/core';

function NowPlaying(props) {
    const [nowPlaying, setNowPlaying] = useState(null);

    useEffect(() => {
        fetch('/now-playing')
            .then(response => {
                return response.json()
            })
            .then(playback => {
                if (playback) {
                    console.log('NowPlaying.js', playback)
                    setNowPlaying(playback);    
                }
                
            })
            .catch(error => console.log(error));
    }, []);
    
    return (
        <div className='now-playing'>
            <h2>Now Playing</h2>
            <br/>
                
                    {nowPlaying ? 
                    <div className='user-now-playing' >
                        <div className='now-playing-header'>
                            <Avatar className='now-playing-avatar' src={props.user.avatar}/>
                            <p className='now-playing-username'>@{props.user.username}</p>
                        </div>
                        {/* <div className='user-track' >
                            <a className='now-playing-track' href={nowPlaying.external_urls.spotify} target='_blank' >{nowPlaying.name}</a>
                            <p>by</p>
                            <a className='now-playing-artist' href={nowPlaying.artists[0].external_urls.spotify} target='_blank' >{nowPlaying.artists[0].name}</a>
                            <p>from</p>
                            <a className='now-playing-album' href={nowPlaying.album.external_urls.spotify} target='_blank' >{nowPlaying.album.name}</a>
                        </div> */}
                        </div>
                    : null}
            <br/>
        </div>
    )
}

export default NowPlaying;
