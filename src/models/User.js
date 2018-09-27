import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

const schema = new mongoose.Schema({
  email: {type: String, required: true, lowercase: true, index: true, unique: true},
  passwordHash: {type: String, required: true},
  confirmed: {type: Boolean, default: false},
  conformationToken: {type: String, default: ''},
}, {timestamps: true});

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.setConformationToken = function setConformationToken() {
  this.conformationToken = this.generateJWT();
};

schema.methods.generateConfirmationURL = function generateConfirmationURL() {
  return `${process.env.HOST}/confirmation/${this.conformationToken}`;
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
    email: this.email,
    confirmed: this.confirmed,
  }, process.env.JWT_SECRET);
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    confirmed: this.confirmed,
    token: this.generateJWT(),
  };
};

schema.plugin(uniqueValidator, {message: 'Someone already has this shit taken'});
export default mongoose.model('User', schema);
