const MediaOutputType = require('../misc/MediaOutputType')
const encoding_headers = require('../misc/EncodingHeaders');
module.exports = function OutputMedia(res, info, type, media, ext) {
    media.catch(e => console.log(e));

    switch (type.toLowerCase()) {
        case MediaOutputType.DOWNLOAD: {    

            media.then( (rawStream) => {
                     
                res.header('Content-Disposition', `attachment; filename=media.${ext}`);
                
                rawStream.pipe(res);
            })
            break;
        }
        case MediaOutputType.STREAM: {
            media.then( (stream) => {
                stream.pipe(res)
                res.writeHead(200, 
                    
                    (info.fileType === 'mp4') ? encoding_headers.mp4 : encoding_headers.mp3
                );
            
            });
            break;
        }
        default:
            res.statusMessage = "API error"
            res.statusCode = 500; 
            res.end();
            break;
    }
    
    
}