import express from 'express';
import User from '../models/User';

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

export default router;
