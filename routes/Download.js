const MediaOutputType = require('../misc/MediaOutputType')
const YtDownloader = require('../modules/YtDownloader')
const AddMedia = require('../modules/AddMedia')

module.exports = function Download(express_handler) {
    express_handler.get('/download', async (req, res) => {
        var yid = req.query.ID;
        var tp = req.query.TYPE

        AddMedia(req, res, {ID: yid, TYPE: tp, DOWNLOADER: new YtDownloader()}, MediaOutputType.DOWNLOAD);
    })
}