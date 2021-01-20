const mongoose = require('mongoose'); 
const express = require('express')
const app = express()
const port = 3001
const router = require('./router')

app.use(express.json());
app.use(router)

mongoose.connect('mongodb://localhost/todos')
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("Database connected")
});