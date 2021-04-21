const MediaOutputType = require('../misc/MediaOutputType')
const YtDownloader = require('../modules/YtDownloader')
const AddMedia = require('../modules/AddMedia')

module.exports = function Stream(express_handler) {
    express_handler.get('/stream/:ID', async (req, res) => {
        var url = req.query.url;
        var yid = req.params.ID;
        var tp = req.query.TYPE

        console.log({url, yid, tp})

        AddMedia(req, res, {ID: yid, TYPE: tp, DOWNLOADER: new YtDownloader()}, MediaOutputType.STREAM);
    })
}