import React from 'react';

import './UserPlayback.css';

import { Avatar } from '@material-ui/core';

    {/* {nowPlaying ? 
                    <div className='user-now-playing' >
                        <div className='now-playing-header'>
                            <Avatar className='now-playing-avatar' src={props.user.avatar}/>
                            <p className='now-playing-username'>@{props.user.username}</p>
                        </div>
                        <div className='user-track' >
                            <a className='now-playing-track' href={nowPlaying.external_urls.spotify} target='_blank' >{nowPlaying.name}</a>
                            <p>by</p>
                            <a className='now-playing-artist' href={nowPlaying.artists[0].external_urls.spotify} target='_blank' >{nowPlaying.artists[0].name}</a>
                            <p>from</p>
                            <a className='now-playing-album' href={nowPlaying.album.external_urls.spotify} target='_blank' >{nowPlaying.album.name}</a>
                        </div>
                        </div>
                    : null} */}

function UserPlayback(props) {
    return (
        <div className='user-now-playing'>
            <div className='user-now-playing-header'>
                <Avatar className='now-playing-avatar' src={props.user_playback.user.avatar} />
                <p className='now-playing-username'>@{props.user_playback.user.username}</p>
            </div>
            <div className='user-track'>
                <a 
                    className='now-playing-track' 
                    href={props.user_playback.playback.external_urls.spotify} 
                    target='_blank'
                >
                    {props.user_playback.playback.name}
                </a>
                <p>by</p>
                <a 
                    className='now-playing-artist'
                    href={props.user_playback.playback.artists[0].external_urls.spotify}
                    target='_blank'
                >
                    {props.user_playback.playback.artists[0].name}
                </a>
                <p>from</p>
                <a 
                    className='now-playing-album'
                    href={props.user_playback.playback.album.external_urls.spotify}
                    target='_blank'
                >
                    {props.user_playback.playback.album.name}
                </a>
            </div>
        </div>
    )
};

export default UserPlayback;