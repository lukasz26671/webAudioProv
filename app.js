
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const fetch = require('node-fetch')
const port = process.env.PORT || 80

// "node-fetch": "^2.6.1",
const encoding_headers = {
    mp3:{
        'Accept-Ranges': 'bytes',
        'Connection':'keep-alive',
        'Transfer-Encoding':'chunked',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        "Content-Disposition":"inline",
        "Content-Transfer-Enconding":"binary",
        'Content-Type': 'audio/mpeg'
    }, 
    mp4:{
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


//todo move to separate file
let config = {
    mainEntry: "index.html"
}

app.use(cors());
app.use(express.static('public'))

let httpServer = app.listen(port, ()=>{
    console.log(`Server running on  ${httpServer.address().address}:${port}`)
})

//? Status for API and website
app.get('/api/status', async (req, res) => {

    const response = CheckStatus();

    await res.json({
        code: 200,
        statusMessage: response,
    })
})

//? Status for API and website with visualization
app.get('/status', async (req, res) => {

    const response = CheckStatus();

    let generatedPage = `
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"><style>*{font-family: 'Roboto'}</style>
    <div>
    `;

    res.statusCode = 200;

    generatedPage += `<p>Response code: <span style="color: blue">${res.statusCode}</span></p>`
    generatedPage += `<p>Website status: <span style="color: ${websiteStatus ? 'lime' : 'red'}">${response.website}</span></p>`
    generatedPage += `<p>API status: <span style="color: ${apiStatus ? 'lime' : 'red'}">${response.api}</span></p>`

    generatedPage += '</div>'

    res.send(generatedPage);
})

const SendMedia = async (req, res, parquery) => {

    try {
        var url;
        var yid;
        var tp = req.query.TYPE
        
        if(parquery.toLowerCase() === "query") {
            url = req.query.URL || "";
            yid = req.query.ID || "";
        } else if (parquery.toLowerCase() === "params") {
            url = req.params.URL || "";
            yid = req.params.ID || "";
        }
     
        if(tp === undefined) tp = 'mp4'
        
        const info = {
            videoUrl: url === "" ? `https://youtube.com/watch?v=${yid}` : url,
            videoID: yid === "" ? url.split('=')[1] : yid,
            fileType: tp === 'mp4' ? 'mp4' : 'mp3'
        }

        let vidTitle; 

        ytdl.getInfo(`https://youtube.com/watch?v=${yid}`, (err, info)=> {
            app.set('title', vidTitle);
        });
        
        console.table(info)

        if(yid != undefined){

            const downloadedVideo = downloadFromYoutube(`https://youtube.com/watch?v=${yid}`, (info.fileType ==='mp4') ? 'mp4' : 'mp3')

            downloadedVideo.then( (stream) => {
                stream.pipe(res)
                

                res.writeHead(200, 
                    (info.fileType === 'mp4') ? encoding_headers.mp4 : encoding_headers.mp3
                );
            });

        }
    } catch(error) {
        res.statusMessage = "API error"
        res.statusCode = 500;
        console.log(error)
        res.end();
    }
}


app.get('/download', async (req, res) => {
    SendMedia(req, res, "query");
})
app.get('/stream/:ID', async (req, res) => {
    SendMedia(req, res, "params");
})

function downloadFromYoutube(url, format='mp4') {
    return new Promise((resolve, reject) => {
        try{ 
            resolve(
                ytdl(url,
                    {
                        format: (format === 'mp4') ? 'mp4' : (format  === 'mp3') ? 'mp3' : 'mp3',
                        filter: (format === 'mp3') ? 'audioonly' : 'audioandvideo'
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
    res.status(404).send(
        `
        ${ErrorCodeStyle()}
        <h1>404</h1>
        <p>The page you requested does not exist.</p>
        `
    )
}

const CheckStatus = async ()=> {
    let websiteStatus = (await fetch(`https://website-audioprovider.herokuapp.com/`)).ok;
    let apiStatus = (await fetch(`https://website-audioprovider.herokuapp.com/download?ID=kJQP7kiw5Fk&TYPE=mp3`)).ok;

    const response = {
        website: websiteStatus ? `Available` : `Unavaliable`,
        api: apiStatus ? `Available` : `Unavailable`,
    }
    return response;
}

const ErrorCodeStyle = () => {  
    return `<style>@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap'); @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap'); h1 { font-family: 'Roboto'; } p { font-family: 'Open Sans'}</style>`
}

app.use(NotFound);
