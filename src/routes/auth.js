import express from 'express';
import User from '../models/User';
import {sendResetPasswordEmail} from '../mailer';
import jwt from 'jsonwebtoken';

const router = express.Router();// eslint-disable-line

router.post('/', (req, res) => {
  const {info} = req.body;
  User.findOne({email: info.email}).then((user) => {
    if (user && user.isValidPassword(info.password)) {
      res.json({user: user.toAuthJSON()});
    } else {
      res.status(400).json({errors: {global: 'Invalid Bitch'}});
    }
  });
});

router.post('/confirmation', (req, res) => {
  const token = req.body.token;
  User.findOneAndUpdate({conformationToken: token}, {conformationToken: '', confirmed: true}, {new: true}).then((user) =>
    user ? res.json({user: user.toAuthJSON()}) : res.status(400).json({errors: 'AAAA'}));
});

router.post('/validate_token', (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (err) => {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});

router.post('/reset_password', (req, res) => {
  User.findOne({email: req.body.email}).then((user) => {
    if (user) {
      sendResetPasswordEmail(user);
      res.json({});
    } else {
      res.status(400).json({errors: {global: 'No one with that email bitch'}});
    }
  });
});

router.post('/resetting_password', (req, res) => {
  const {password, token} = req.body.data;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({errors: {global: 'The token is Dead'}});
    } else {
      User.findOne({_id: decoded._id}).then((user) => {
        if (user) {
          user.setPassword(password);
          user.save().then(() => res.json({}));
        } else {
          res.status(404).json({errors: {global: 'Bullshit token'}});
        }
      });
    }
  });
});

export default router;
