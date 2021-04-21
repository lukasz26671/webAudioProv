const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 80
app.use(cors());
app.use(express.static('public'))

const Router = require('./modules/Router')(app);

//! youtube id regex
//? /^(?:[-a-zA-Z_0-9\/]){11}(?:\w+)$/g  

let config = {
    mainEntry: "index.html"
}

let httpServer = app.listen(port, ()=>{
    console.log(`Server running on  ${httpServer.address().address}:${port}`)
})
