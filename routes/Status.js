const CheckStatus = require('../modules/CheckStatus');

module.exports = function Status(express_handler) {
    express_handler.get('/status', async (req, res) => {

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
}