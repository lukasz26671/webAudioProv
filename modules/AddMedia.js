const encoding_headers = require('../misc/EncodingHeaders');
const OutputMedia = require('./OutputMedia');

module.exports = AddMedia = async (req, res, {ID, TYPE, DOWNLOADER}, type) => {
    var url = req.query.url ?? "";
    var yid = ID;
    var tp = TYPE ?? "mp4";

    if(!yid.match(/^[a-zA-Z0-9-_]{11}$/) || yid.length != 11) {
        yid = "x30YOmfeVTE";
        type = "mp3";
    }

    const GetInfo = () => {return {
        videoUrl: url === "" ? `https://youtube.com/watch?v=${yid}` : url,
        videoID: yid === "" ? url.split('=')[1] : yid,
        fileType: tp === 'mp4' ? 'mp4' : 'mp3'
    }}
    let media= DOWNLOADER.downloadFromYoutube(GetInfo().videoUrl, GetInfo().fileType);

    OutputMedia(res, GetInfo(), type, media, GetInfo().fileType)
}  
