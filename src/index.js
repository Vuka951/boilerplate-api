import express from 'express';
import path from 'path';

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.post('/api/auth', function(req, res) {
  res.status(400).json({errors: {global: 'Invalid Info'}});
});


app.get('/*', (req, res) =>{
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080, () => console.log('Running for my life on :8080'));


