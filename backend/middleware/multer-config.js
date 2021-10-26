const multer = require('multer');
// on appele multer qu''on a installer

// on creer une bibliotheque d"extension
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const regexInput= /([ <>{}'"=:.,;!\?\\\/\]\[])+/g ;

    const name = JSON.parse(req.body.sauce).name.replaceAll(regexInput,"-");


    const extension = MIME_TYPES[file.mimetype];
    callback(null,name +"_"+ Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');
// puis on exporte le middleware
