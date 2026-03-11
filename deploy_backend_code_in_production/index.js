const express = require('express')
require('dotenv').config()
// import express from 'express'
const app = express()
// const port = 3000

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/twitter', (req, res) => {
    res.send('azeemahmadX');
})

app.get('/login', (req, res) => {
    res.send('<h1>Please Login at azeem.com</h1>');
})

app.get('/youtube', (req, res) => {
    res.send('https://www.youtube.com/results?search_query=shriyans+coding+school+backenbd+dev');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

// use callbacks most of the times
// app is constantly listening (you have made a sever)
//A .env file stores environment variables — values that your application needs but should not be written directly in the code.
