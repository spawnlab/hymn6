const STREAM_SERVER = "http://localhost";
const STREAM_PORT = "8000";
const STREAM_PATH = "/_a";
const STREAM_API_PATH = "/api/live-info-v2";
const BACKEND_SERVER = "http://localhost";
const BACKEND_PORT = "3000";

window.onload = function() {
    if (document.monetization) {
        if (document.monetization.state === 'stopped') {
            console.log("OnLoad: Monetization stopped!");
            document.getElementById('wm-absent').classList.add('hidden');
            document.getElementById('wm-stopped').classList.remove('hidden');
            document.getElementById('wm-loading').classList.add('hidden');
            document.getElementById('single-song-player-loading').classList.add('hidden');
            document.getElementById('single-song-player').classList.add('hidden');
            document.getElementById('wm-icon-stopped').classList.remove('hidden');
            document.getElementById('wm-icon-started').classList.add('hidden');
            document.getElementById('red-led').classList.remove('hidden');
            document.getElementById('yellow-led').classList.add('hidden');
            document.getElementById('green-led').classList.add('hidden');
        } 
        document.monetization.addEventListener('monetizationpending', () => {
            console.log("Monetization pending!")
            document.getElementById('wm-absent').classList.add('hidden');
            document.getElementById('wm-stopped').classList.add('hidden');
            document.getElementById('wm-loading').classList.remove('hidden');
            document.getElementById('single-song-player-loading').classList.add('hidden');
            document.getElementById('single-song-player').classList.add('hidden');
            document.getElementById('wm-icon-stopped').classList.remove('hidden');
            document.getElementById('wm-icon-started').classList.add('hidden');
            document.getElementById('red-led').classList.add('hidden');
            document.getElementById('yellow-led').classList.remove('hidden');
            document.getElementById('green-led').classList.add('hidden');
        });
        document.monetization.addEventListener('monetizationstart', () => {
            console.log("Monetization started!");
            document.getElementById('wm-absent').classList.add('hidden');
            document.getElementById('wm-stopped').classList.add('hidden');
            document.getElementById('wm-loading').classList.add('hidden');
            document.getElementById('single-song-player-loading').classList.remove('hidden');
            document.getElementById('single-song-player').classList.add('hidden');
            document.getElementById('wm-icon-stopped').classList.add('hidden');
            document.getElementById('wm-icon-started').classList.remove('hidden');
            document.getElementById('red-led').classList.add('hidden');
            document.getElementById('yellow-led').classList.remove('hidden');
            document.getElementById('green-led').classList.add('hidden');
            setTimeout(()=> {
                document.getElementById('single-song-player-loading').classList.add('hidden');
                document.getElementById('single-song-player').classList.remove('hidden');
                Amplitude.init({
                    "bindings": {
                        32: 'play_pause'
                    },
                    "songs": [
                        {
                            "name": "Now Playing - ",
                            "cover_art_url": "",
                            "artist": "By - ",
                            "url": STREAM_SERVER+":"+STREAM_PORT+STREAM_PATH,
                            "genre": "Genre - ",
                            "live": true
                        }
                    ]
                });
                async function getLiveInfo() {
                    let response = await fetch(STREAM_SERVER+STREAM_API_PATH);
                    let data = await response.json();
                    return data;
                }
                async function getRandomCoverart(id) {
                    let response = await fetch(BACKEND_SERVER+":"+BACKEND_PORT+"/coverart/?id="+id);
                    let data = await response.json();
                    return data;
                }
                function setSongDetails() {
                    getLiveInfo()
                        .then(liveInfo => {
                            var id;
                            var title;
                            var artist;
                            var genre;
                            var artwork;
                            var coverart;

                            id = liveInfo.tracks.current.metadata.id;
                            title = liveInfo.tracks.current.metadata.track_title;
                            artist = liveInfo.tracks.current.metadata.artist_name;
                            genre = liveInfo.tracks.current.metadata.genre;
                            artwork = liveInfo.tracks.current.metadata.artwork;
                            if (artwork != "") {
                                coverart = STREAM_SERVER+"/api/track?id="+id+"&return=artwork";
                                Amplitude.setSongMetaData(0, 
                                    {
                                        "name": "Now Playing - "+title,
                                        "cover_art_url": coverart,
                                        "artist": "By - "+artist,
                                        "genre": "Genre - "+genre,
                                    }
                                );
                            } else {
                                getRandomCoverart(id)
                                    .then(data => {
                                        coverart = "./img/coverart/"+data;
                                        Amplitude.setSongMetaData(0, 
                                            {
                                                "name": "Now Playing - "+title,
                                                "cover_art_url": coverart,
                                                "artist": "By - "+artist,
                                                "genre": "Genre - "+genre,
                                            }
                                        );
                                });
                            }
                        });
                }
                setSongDetails();
                setInterval(()=> {
                    setSongDetails();
                }, 5000);
                var volumeSlider = document.getElementById('volume-slider');
                var muteButton = document.getElementById('mute-button');
                var currentVolume = 50;
                function toggleMute() {
                    if (Amplitude.getVolume() != 0) {
                        currentVolume = Amplitude.getVolume();
                        Amplitude.setVolume(0);
                        muteButton.src = 'img/volume-muted.svg';
                    } else {
                        Amplitude.setVolume(currentVolume);
                        muteButton.src = 'img/volume.svg';
                    }
                }
                muteButton.addEventListener('click', toggleMute);
                function volumeSliderUpdate() {
                    currentVolume = Amplitude.getVolume();
                    if (currentVolume != 0) {
                        muteButton.src = 'img/volume.svg';
                    } else {
                        muteButton.src = 'img/volume-muted.svg';
                    }
                }
                volumeSlider.addEventListener('input', volumeSliderUpdate);
                var profileBtn = document.getElementById('profile-btn');
                var closeOverlayBtn = document.getElementById('overlay-close-btn');
                var profileOverlay = document.getElementById('user-profile-overlay');
                function openProfileOverlay() {
                    profileOverlay.classList.remove('hidden');
                }
                profileBtn.addEventListener('click', openProfileOverlay);
                function closeProfileOverlay() {
                    profileOverlay.classList.add('hidden');
                }
                closeOverlayBtn.addEventListener('click', closeProfileOverlay);
                var favoriteBtn = document.getElementById('favorite-btn');
                function toggleFavoriteTrack(){
                    favoriteBtn.classList.toggle('md-inactive');
                }
                favoriteBtn.addEventListener('click', toggleFavoriteTrack);
                function updateFavoriteTrack() {
                    favoriteBtn.classList.add('md-inactive');
                }
                setInterval(()=> {
                    updateFavoriteTrack();
                }, 180000);
                var loginBtn = document.getElementById('login-btn');
                async function getUserRecommendations(user) {
                    let response = await fetch(BACKEND_SERVER+":"+BACKEND_PORT+"/recommendations/?user="+user);
                    let data = await response.text();
                    return data;
                }
                function userLogin() {
                    var userId = document.getElementById('login-id').value;
                    var loginPrompt = document.getElementById('login-prompt');
                    if (userId == '') {
                        loginPrompt.innerHTML = 'Please enter your nickname above before logging in!';
                    } else {
                        loginPrompt.innerHTML = 'Hello ' + userId + '!';
                        getUserRecommendations(userId).then(data => {
                            document.getElementById('user-recommendations').innerHTML = data;
                        });
                    }
                }
                loginBtn.addEventListener('click', userLogin);
                document.getElementById('yellow-led').classList.add('hidden');
                document.getElementById('green-led').classList.remove('hidden');   
            }, 2500);
        });
        document.monetization.addEventListener('monetizationprogress', () => {
            console.log("Monetization in progress...");
        });
        document.monetization.addEventListener('monetizationstop', () => {
            console.log("Monetization stopped!");
            document.getElementById('wm-absent').classList.add('hidden');
            document.getElementById('wm-stopped').classList.remove('hidden');
            document.getElementById('wm-loading').classList.add('hidden');
            document.getElementById('single-song-player-loading').classList.add('hidden');
            document.getElementById('single-song-player').classList.add('hidden');
            document.getElementById('wm-icon-stopped').classList.remove('hidden');
            document.getElementById('wm-icon-started').classList.add('hidden');
            document.getElementById('red-led').classList.remove('hidden');
            document.getElementById('yellow-led').classList.add('hidden');
            document.getElementById('green-led').classList.add('hidden');    
        });
    } else {
        console.log("Monetization not enabled!");
        document.getElementById('wm-absent').classList.remove('hidden');
        document.getElementById('wm-stopped').classList.add('hidden');
        document.getElementById('wm-loading').classList.add('hidden');
        document.getElementById('single-song-player-loading').classList.add('hidden');
        document.getElementById('single-song-player').classList.add('hidden');
        document.getElementById('wm-icon-stopped').classList.remove('hidden');
        document.getElementById('wm-icon-started').classList.add('hidden');
        document.getElementById('red-led').classList.remove('hidden');
        document.getElementById('yellow-led').classList.add('hidden');
        document.getElementById('green-led').classList.add('hidden'); 
    }
};

window.onkeydown = function(e) {
    return !(e.keyCode == 32);
};
