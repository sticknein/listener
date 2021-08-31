import React from 'react';
import './Activity.css';

function Activity(props) {
    return (
        <div className='activity'>
            <h2>Activity</h2>
            <br/>
            {/* <p>{Spotify.nowPlaying()}</p> */}
            <br/>
            <p>John Doe is listening to John Denver artist radio</p>
            <br />
            <p>William Patrick Corgan is listening to the 'Sad Clown Music' playlist</p>
            <br />
            <p>Kanye West is listening to Kanye West</p>
            <br />
            <p>John Smith is listening to 'The Pocahontas Soundtrack'</p>
            <br />
            <p>Holophone is listening to his playlist 'djmeplz'</p>
            <br />
            <p>Mayacamas is listening to Holophone's playlist 'Altimeter'</p>
        </div>
    )
}

export default Activity;
