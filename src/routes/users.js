import express from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors';
import {sendConformationEmail} from '../mailer';

const router = express.Router(); //eslint-disable-line

router.post('/', (req, res) => {
  const {email, password} = req.body.user;
  const user = new User({email});
  user.setPassword(password);
  user.setConformationToken();
  user.save()
    .then((user) => {
      sendConformationEmail(user);
      res.json({user: user.toAuthJSON()});
    })
    .catch((err) => res.status(400).json({errors: parseErrors(err.errors)}));
});

export default router;
