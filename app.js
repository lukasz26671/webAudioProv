const http = require('http');
const port = process.env.PORT || 3000



const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`<h1>Hello world!</h1><p>What are you doing here mate :)`)
});

server.listen(port, ()=> {
    console.log(`Server running at port ${port}`);
})