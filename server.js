const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()
const PORT = process.env.APP_PORT

// MIDDLEWARES
app.use(express.static(path.resolve(__dirname, 'assets')))

// ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'))
})
app.get('/movies', (req, res) => {
  res.sendFile(path.resolve(__dirname, './movies.html'))
})
app.get('/sessions', (req, res) => {
  res.sendFile(path.resolve(__dirname, './sessions.html'))
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})