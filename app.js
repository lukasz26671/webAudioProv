
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const app = express();
const fetch = require('node-fetch')
const port = process.env.PORT || 3000


//todo move to separate file
let config = {
    mainEntry: "index.html"
}

app.use(cors());
app.use(express.static('public'))

let httpServer = app.listen(port, ()=>{
    console.log(`Server running on  ${httpServer.address().address}:${port}`)
})

//? Root request
//todo use express static?
// app.get('/', (req, res)=>{
// }) 

//? Status for API and website
app.get('/status', async (req, res) => {

    let websiteStatus = (await fetch(`https://website-audioprovider.herokuapp.com/`)).ok;
    let apiStatus = (await fetch(`https://website-audioprovider.herokuapp.com/download?ID=kJQP7kiw5Fk&TYPE=mp3`)).ok;

    const response = {
        website: websiteStatus ? `Available` : `Unavaliable`,
        api: apiStatus ? `Available` : `Unavailable`,
    }

    await res.json({
        code: 200,
        statusMessage: response,
    })
})

//todo - rewrite (uzycie funkcji do konwersji)
app.get('/download', async (req, res) => {
    try {
        var url = req.query.URL;
        var yid = req.query.ID;
        var tp = req.query.TYPE
        
        const info = {
            videoUrl: url === undefined ? `https://youtube.com/watch?v=${yid}` : url,
            videoID: yid === undefined ? url.split('=')[1] : yid,
            fileType: tp === undefined ? 'mp4' : tp
        }

        const resHeaders = {
            mp3: {
                'Accept-Ranges': 'bytes',
                'Connection':'keep-alive',
                'Transfer-Encoding':'chunked',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                "Content-Disposition":"inline",
                "Content-Transfer-Enconding":"binary",
                'Content-Type': 'audio/mpeg'
            },
            mp4: {
                'Accept-Ranges': 'bytes',
                'Connection':'keep-alive',
                'Transfer-Encoding':'chunked',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                "Content-Disposition":"inline",
                "Content-Transfer-Enconding":"binary",
                'Content-Type': 'video/mp4',
                'Success':'true'
            }
        }

        console.table(info)

        if(yid != undefined){

            const downloadedVideo = downloadFromYoutube(`https://youtube.com/watch?v=${yid}`, tp === undefined ? 'mp4' : 'mp3')

            downloadedVideo.then( (stream) => {
                stream.pipe(res)

                res.writeHead(200, 
                    tp === undefined ? resHeaders.mp4 : resHeaders.mp3
                );
            });
            
        }
    } catch(error) {
        res.statusMessage = "API error"
        res.statusCode = 500;
        console.log(error)
        res.end();
    }
})


//? let's stop supporting this maybe?
/* 
    app.get("/***********", (req, res) => {
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
*/

function downloadFromYoutube(url, format='mp4') {
    return new Promise((resolve, reject) => {
        try{ 
            resolve(
                ytdl(url,
                    {
                        format: format === 'mp3' ? 'mp3' : 'mp4',
                        filter: format === 'mp3' ? 'audioonly' : 'audioandvideo'
                    }
                )
            );
        } catch(err) {
            reject(err)
        }
    })
}


//! youtube id regex
//? /^(?:[-a-zA-Z_0-9\/]){11}(?:\w+)$/g  



//! Używać poprzez app.use() na końcu kodu
//TODO: Bardziej przejrzysty error message
function NotFound(req, res, next) {
    res.status(404).send('404: Not found')
}

app.use(NotFound);


//todo - rewrite
function conv(form, {url="", yid=undefined}, pipe) {
    if(url != ""){
        ytdl(url, {
            format: form
        }).pipe(pipe);
    }
}

//? Old website handling
/*
app.use(cors());

app.listen(port, ()=> {
    console.log(`Server running at ${port}`);
})
app.get('/', (req, res)=> {
    res.sendFile(`${__dirname}/index.html`);
})

app.get('/download', (req, res) => {
    var url = req.query.url;
    res.header('Content-Disposition', 'attachment; filename="video.mp3"');
    ytdl(url, {
        format: 'mp3'
    }).pipe(res);
}); 
*/

