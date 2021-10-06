const express = require('express');
const router =express.Router();

const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
// verification de l'identité
const multer = require('../middleware/multer-config');
//manipulation de fichier
const test = require('../middleware/test');


router.get('/',auth,sauceCtrl.getAllSauces);
router.get('/:id',test,auth,sauceCtrl.getOneSauce);


router.post('/',test,auth,multer,sauceCtrl.addSauce);
router.put('/:id',auth,multer,sauceCtrl.updateSauce);
router.delete('/:id',auth,sauceCtrl.deleteSauce);

// router.post('/:id/like',auth ,sauceCtrl.addSauce);

module.exports = router;


