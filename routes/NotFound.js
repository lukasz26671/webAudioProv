const ErrorCodeStyle = require("../misc/ErrorCodeStyle");

module.exports = function NotFound(req, res, next) {
    res.status(404).send(
        `
        ${ErrorCodeStyle()}
        <h1>404</h1>
        <p>The page you requested does not exist.</p>
        `
    )
}