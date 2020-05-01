
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
    res.sendFile(`${__dirname}/${config.mainEntry}`)
    res.sendFile(`${__dirname}/styles.css`)
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
        if(yid != undefined) {
            ytdl(yid, {
                format: 'mp3'
            }).pipe(res);
        }
    } catch(error) {console.log(error)}
})

app.get('**********', (req, res) => {
    try {
        if(req.url.includes("favicon")) return;
        ffmpeg().kill();
        var stream = ffmpeg().setFfmpegPath(ffmpegPath);
        stream.on('error', (err, stdout, stderr)=>{
            console.log(err.message);
        })

        let u = req.url.split('/')[1];
        let ur = `youtube.com/watch?v=${u}`;
        res.set({"Content-Type": "audio/mpeg" });
        stream.input(ytdl(ur)).toFormat('mp3').pipe(res, {end: true}).on('end', ()=>{
            console.log('Finished');
        });
    } catch (error) {console.log(error)}
})

function conv(form, {url=undefined, yid=undefined}, pipe) {
    if(url != undefined){
        ytdl(url, {
            format: form
        }).pipe(pipe);
    }
    if(yid != undefined) {
        ytdl(yid, {
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
