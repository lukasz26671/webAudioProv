const NotFound = require("../routes/NotFound");
const Status = require("../routes/Status");
const Stream = require("../routes/Stream");
const Download = require("../routes/Download");

module.exports = function Router(app) {
    
    //Add status route
    Status(app);
    
    //Add stream route
    Stream(app);

    //Add download route
    Download(app); 

    //At the end, use the Not Found error code if route is not defined.
    app.use(NotFound);

}