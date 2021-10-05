const express = require('express');
const router =express.Router();

const sauceCtrl = require('../controllers/sauce');


router.get('/',sauceCtrl.getAllSauces);
router.get('/:id',sauceCtrl.getOneSauce);


const auth = require('../middleware/auth');
// verification de l'identité
const multer = require('../middleware/multer-config');
//manipulation de fichier

router.post('/',auth,multer,sauceCtrl.addSauce);


module.exports = router;


