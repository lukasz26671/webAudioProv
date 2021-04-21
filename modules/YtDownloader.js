const ytdl = require('ytdl-core');

module.exports = class YtDownloader {
    constructor() {

    }
    async downloadFromYoutube(url, format) {
        switch(format.toLowerCase()) {
            case "mp4":
                return this.downloadFromYoutubeVideo(url);
            case "mp3":
            default:
                return this.downloadFromYoutubeAudio(url);
        }
    }
    downloadFromYoutubeVideo(url) {
        return new Promise((resolve, reject) => {
            try{ 
                resolve(
                    
                    ytdl(url,
                        {
                            format: 'mp4',
                            filter: 'audioandvideo'
                        }
                    )
                );
            } catch(err) {
                reject(err)
            }
        })
    }
    downloadFromYoutubeAudio(url) {
        return new Promise((resolve, reject) => {
            try{ 
                resolve(
                    
                    ytdl(url,
                        {
                            format: 'mp3',
                            filter: 'audioonly'
                        }
                    )
                );
            } catch(err) {
                reject(err)
            }
        })
    }
}