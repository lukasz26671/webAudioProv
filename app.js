
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const ytdl = require('ytdl-core');
const youtubeSteam = require('youtube-audio-stream');

const app = express();
const port = process.env.PORT || 3000

let config = {
    mainEntry: "index.html"
}

// app.use(cors());

// app.listen(port, ()=> {
//     console.log(`Server running at ${port}`);
// })
// app.get('/', (req, res)=> {
//     res.sendFile(`${__dirname}/index.html`);
// })

// app.get('/download', (req, res) => {
//     var url = req.query.url;
//     res.header('Content-Disposition', 'attachment; filename="video.mp3"');
//     ytdl(url, {
//         format: 'mp3'
//     }).pipe(res);
// });

app.use(cors());


let httpServer = app.listen(port, ()=>{
    console.log(`Server running on  ${httpServer.address().address}:${port}`)
})

app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/${config.mainEntry}`)
}) 

app.get('/download', (req, res) => {
    var url = req.query.URL;
    var yid = req.query.ID;
    res.header('Content-Disposition', 'attachment; filename="vid_converted.mp3"');

    if(url != undefined){
        ytdl(url, {
            format: 'mp3'
        }).pipe(res);
    }
    if(yid != undefined) {
        ytdl(yid, {
            format: 'mp3'
        }).pipe(res);
    }
})


