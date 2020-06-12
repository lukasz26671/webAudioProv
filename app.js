
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const app = express();
const port = process.env.PORT || 3000

let config = {
    mainEntry: "index.html"
}

app.use(cors());

let httpServer = app.listen(port, ()=>{
    console.log(`Server running on  ${httpServer.address().address}:${port}`)
})

app.get('/', (req, res)=>{
    res.sendStatus(200);
}) 

app.get('/download', (req, res) => {
    try {
        var url = req.query.URL;
        var yid = req.query.ID;
        res.header('Content-Disposition', 'attachment; filename="vid_converted.mp4"');

        if(url != undefined){
            ytdl(url, {
                format: 'mp4',
                quality: "highestvideo"
            }).pipe(res);
        }
    } catch(error) {console.log(error)}
})

app.get(/^(?:[-a-zA-Z_0-9]){0,10}(?:\w+)$/g, (req, res) => {
    try {
        ffmpeg().kill();

        var stream = ffmpeg().setFfmpegPath(ffmpegPath);

        stream.on('error', (err, stdout, stderr)=>{
            console.log(err.message);
        })
        console.log(req.url)
        let u = req.url.split('/')[1];
        let ur = `https://youtube.com/watch?v=${u}`;

        res.set({"Content-Type": "audio/mpeg" });

        stream.input(
                ytdl(ur)).toFormat('mp3').pipe(res, {end: true}
        ).on('end', ()=>{
            console.log('Finished');
        });

    } catch (error) {console.log(error)}
})

function conv(form, {url="", yid=undefined}, pipe) {
    if(url != ""){
        ytdl(url, {
            format: form
        }).pipe(pipe);
    }
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

