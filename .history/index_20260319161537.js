import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./lab5/index.js";
import cors from "cors";
import db from "./kambaz/database/index.js";
import CourseRoutes from "./(kambaz)/courses/routes.js";
import UserRoutes from "./kambaz/users/routes.js";
import "dotenv/config";
import session from "express-session";

// const express = require('express')
// const app = express()
// app.get('/hello', (req, res) => {res.send('Hello World!')})
// app.listen(4000)
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app, db);
CourseRoutes(app, db);
Lab5(app);
Hello(app);
// app.get('/hello', (req, res) => {res.send('Life is good!')})
// app.get('/', (req, res) => {
//   res.send('Welcome to Full Stack Development!')})
app.listen(4000)