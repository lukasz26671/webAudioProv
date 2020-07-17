const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000

// if(process.argv[2] == 'check') {
//     if(process.argv[3] != null) {
//         (async () => {
//             const {ytdl, ffmpeg, ffmpegPath} = await importDependencies();

//             try {
//                 if(req.url.includes("favicon")) return;
//                 ffmpeg().kill();
        
//                 var stream = ffmpeg().setFfmpegPath(ffmpegPath);
        
//                 stream.on('error', (err, stdout, stderr)=>{
//                     console.log(err.message);
//                 })
        
//                 console.log(`GET: ${req.url}`);
        
//                 let url = `https://youtube.com/watch?v=${req.url.split('/')[2]}`;
        
//                 res.set({"Content-Type": "audio/mpeg" });
        
//                 res.statusCode = 302;
        
//                 stream.input(ytdl(url)).toFormat('mp3').on('end', ()=>{
//                     console.log('Finished');
//                 });
//                 process.exit(0)
//             } catch (error) {
//                 process.exit(1)
//             }

//         })();
//     }
// } else {
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
    
    app.get('/api/***********', async (req, res) => {
        const {ytdl, ffmpeg, ffmpegPath} = await importDependencies();
    
        try {
            if(req.url.includes("favicon")) return;
            ffmpeg().kill();
    
            var stream = ffmpeg().setFfmpegPath(ffmpegPath);
    
            stream.on('error', (err, stdout, stderr)=>{
                console.log(err.message);
            })
    
            console.log(`GET: ${req.url}`);
    
            let url = `https://youtube.com/watch?v=${req.url.split('/')[3]}`;
    
            res.set({"Content-Type": "audio/mpeg" });
    
            res.statusCode = 302;
    
            stream.input(
                    ytdl(url)).toFormat('mp3').pipe(res, {end: true}
            ).on('end', ()=>{
                console.log('Finished');
            });
    
        } catch (error) {
            res.statusMessage = "API error"
            console.log(error)
            res.status(500).end();
        }
    })
    
    /*
       ! Używać poprzez app.use() na końcu kodu
       TODO: Bardziej przejrzysty error message
    */
    function NotFound(req, res, next) {
        res.status(404).send('404: Not found')
    }
    
    app.use(NotFound);
    
// }
function importDependencies() {

    const ytdl = require('ytdl-core');
    const ffmpeg =  require('fluent-ffmpeg');
    const ffmpegPath =  require('@ffmpeg-installer/ffmpeg').path;

    return {ytdl, ffmpeg, ffmpegPath};
}
