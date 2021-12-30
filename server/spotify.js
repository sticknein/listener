const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config({ path: '../.env'})

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirect_uri = process.env.REACT_APP_REDIRECT_URI;

const Spotify = new SpotifyWebApi({
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI
});

const nowPlaying = () => {
    return Spotify.getMyCurrentPlaybackState()
                .then(data => {
                    console.log('spotify.js data', data)
                    return data;
                })
                .catch(error => console.log(error));
}

module.exports = {
    nowPlaying
};