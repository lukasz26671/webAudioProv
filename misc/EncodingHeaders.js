module.exports = {
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
