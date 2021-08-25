
const express = require('express');        
const app = express();                 
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const server = http.createServer(app);

const cors = require('cors');



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/distancesDB');
const port = process.env.PORT || 3000;       
let dbConnected = false;

const router = require('./router');            


app.get('/hello', (req, res) => {
    res.json({}).status(200);
})
app.get('/health', (req, res) => {
    if (dbConnected)
        res.json({}).status(200);
    else
        res.json({message: 'db is not connected'}).status(500);
})

app.use(function(req, res, next) {
    res.status(404)})

app.use('/api', router);

mongoose.Promise = global.Promise;


var db = mongoose.connection;
db.on('error', (err) => {
    dbConnected = false;
    console.error.bind(console, 'connection error:')
});
// we wait till mongo is ready before letting the http handler query users:
db.once('open', function () {
    console.log('Running');
    dbConnected = true;
});
server.listen(port, () => {
    console.log('Blockbuster Server listen on port 3000\n\n');
});
