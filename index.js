const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');

const PORT = 8000;
const tempFileDir = path.join(__dirname, 'temp');

const app = express();
app.use('/form', express.static(__dirname + '/index.html'));

app.use('/upload', fileUpload({
  debug: true,
  useTempFiles: true,
  tempFileDir,
}));

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  const uploads = Object.keys(req.files).map((key) => {
    const file = req.files[key];
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    return file.mv(uploadPath);
  });

  Promise.all(uploads)
    .then(() => res.send('Files uploaded to ' + path.join(__dirname, 'uploads')))
    .catch(err => res.status(500).send(err));
});

app.listen(PORT, () => {
  console.log('Server listening on port ', PORT); // eslint-disable-line
});
