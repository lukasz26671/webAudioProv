
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
        var tp = req.query.TYPE

        res.header('Content-Disposition', 'attachment');
        console.log(url, yid, tp)
        if(yid != undefined){
            if(tp === 'mp3') {
                ytdl(`https://youtube.com/watch?v=${yid}`, {
                    format: 'mp3',
                    filter: 'audioonly'
                }).pipe(res);

                res.writeHead(200, {
                    'Accept-Ranges': 'bytes',
                    'Connection':'keep-alive',
                    'Transfer-Encoding':'chunked',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    "Content-Disposition":"inline",
                    "Content-Transfer-Enconding":"binary",
                    'Content-Type': 'audio/mpeg'
                });
            } else if(tp === undefined || tp === 'mp4') {
                ytdl(`https://youtube.com/watch?v=${yid}`, {
                    format: 'mp4',
                }).pipe(res);

                res.writeHead(200, {
                    'Accept-Ranges': 'bytes',
                    'Connection':'keep-alive',
                    'Transfer-Encoding':'chunked',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    "Content-Disposition":"inline",
                    "Content-Transfer-Enconding":"binary",
                    'Content-Type': 'video/mp4'
                });
            }
        }
    } catch(error) {
        res.statusMessage = "API error"
        res.statusCode = 500;
        console.log(error)
        res.end();
    }
})

app.get(/*/^(?:[-a-zA-Z_0-9\/]){0,10}(?:\w+)$/g*/"/***********", (req, res) => {
    try {
        if(req.url.includes("favicon")) return;
        
        const stream = ffmpeg({timeout: 15}).setFfmpegPath(ffmpegPath)

        stream.on('error', err => console.log(err))

        console.log(`GET: ${req.url}`);
        
        let uri = `https://youtube.com/watch?v=${
            req.url.split('/')[1]
        }`;

        console.log(uri)

        ytdl(uri, {format: 'mp4'})
        .addListener('end', (err) => console.log(err))   
        .pipe(res)
        
        res.writeHead(302, {
            'Accept-Ranges': 'bytes',
            'Connection':'keep-alive',
            'Transfer-Encoding':'chunked',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            "Content-Disposition":"inline",
            "Content-Transfer-Enconding":"binary",
            'Content-Type': 'video/mp4'
        });
        
        
        
    } catch (error) {
        res.statusMessage = "API error"
        console.log(error)
        res.status(500).end();
    }
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

