const CLIENT = 'http://localhost:8001';
const STREAM_SERVER = 'http://localhost';

const express = require('express');
const cors = require('cors');
const fs = require('fs');

const coverartDir = '../img/coverart/';
const coverarts = fs.readdirSync(coverartDir);

const recommendationTracksList = [
    {"id":1,"title":"Excuse All Blood...","artist":"AmortE","genre":"Death-Metal"},
    {"id":2,"title":"Shun-in","artist":"Pleiades M","genre":"IDM"},
    {"id":3,"title":"We Wanna Rock","artist":"Чокнутый Пропеллер","genre":"Punk"},
    {"id":4,"title":"The Silent Sea","artist":"Luno","genre":"Alternate"},
    {"id":5,"title":"The Way","artist":"Heavy Links","genre":"Rock"},
    {"id":6,"title":"Orbs of Light","artist":"Moons","genre":"Ambient"},
    {"id":7,"title":"Sundancer","artist":"Wild Shores","genre":"Post-Rock"},
    {"id":8,"title":"Fire","artist":"Apache Tomcat","genre":"Lo-Fi"},
    {"id":9,"title":"Yurtology","artist":"Michett","genre":"Electronic"},
    {"id":10,"title":"Revolution Summer","artist":"Simon Waldram","genre":"Pop"}
];

const app = express();
const port = 3000;

var corsOptions = {
    origin: CLIENT,
    methods: "GET"
};

app.get('/', (req, res) => {
    res.send('srv@hymn6-saplingv0.1.4 by SpawnLab');
});

app.get('/coverart', cors(corsOptions), (req, res) => {
    let id = req.query.id;
    let len = coverarts.length;
    let coverart = coverarts[(id % len + len) % len];
    res.json(coverart);
});

app.get('/recommendations', cors(corsOptions), (req, res) => {
    let user = req.query.user;
    var recommendedTracks = [];
    while(recommendedTracks.length < 3){
        var r = Math.floor(Math.random() * 10);
        if(recommendedTracks.indexOf(recommendationTracksList[r]) === -1) recommendedTracks.push(recommendationTracksList[r]);
    }
    var resText = '';
    recommendedTracks.forEach(
        function(item, index) {
            resText += '<div><a href="' + STREAM_SERVER + '/audiopreview/audio-preview/audioFileID/' + item.id + '/type/audioclip" target="_blank">'+ item.title + ' by ' + item.artist + ' in ' + item.genre +'</a></div>';
        }
    );
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(resText);
    res.end();
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
