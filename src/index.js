import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import auth from './routes/auth';
import users from './routes/users';
// import bcryptjs from 'bcryptjs';
dotenv.config();
const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
app.use('/api/auth', auth);
app.use('/api/users', users);

app.get('/*', (req, res) =>{
  res.sendFile(path.join(__dirname, 'index.html'));
});
// var bcrypt = require('bcryptjs');
// console.log(bcrypt.hashSync('12345',10))
app.listen(8080, () => console.log('Running for my life on :8080'));
