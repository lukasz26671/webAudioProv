const CheckStatus = require('../../modules/CheckStatus');

module.exports = function ApiStatus(express_handler) {
    express_handler.get('/api/status', async (req, res) => {
        const response = CheckStatus();

        await res.json({
            code: 200,
            statusMessage: response,
        })
    })
}