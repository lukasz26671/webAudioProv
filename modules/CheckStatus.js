module.exports =  CheckStatus = async ()=> {
    let websiteStatus = (await fetch(`https://website-audioprovider.herokuapp.com/`)).ok;
    let apiStatus = (await fetch(`https://website-audioprovider.herokuapp.com/download?ID=kJQP7kiw5Fk&TYPE=mp3`)).ok;

    const response = {
        website: websiteStatus ? `Available` : `Unavaliable`,
        api: apiStatus ? `Available` : `Unavailable`,
    }
    return response;
}
