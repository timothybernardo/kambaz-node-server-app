import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./lab5/index.js";
import cors from "cors";
import db from "./kambaz/database/index.js";
import UserRoutes from "./kambaz/users/routes.js";

// const express = require('express')
// const app = express()
// app.get('/hello', (req, res) => {res.send('Hello World!')})
// app.listen(4000)

const app = express()
UserRoutes(app, db);
app.use(cors()); 
app.use(express.json());
Lab5(app);
Hello(app)
// app.get('/hello', (req, res) => {res.send('Life is good!')})
// app.get('/', (req, res) => {
//   res.send('Welcome to Full Stack Development!')})
app.listen(4000)