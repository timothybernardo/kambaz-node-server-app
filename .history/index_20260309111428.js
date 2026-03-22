// const express = require('express')
// const app = express()
// app.get('/hello', (req, res) => {res.send('Hello World!')})
// app.listen(4000)

const express = require('express')
const app = express()
app.get('/hello', (req, res) => {res.send('Life is good!')})
app.get('/', (req, res) => {
  res.send('Welcome to Full Stack Development!')})
