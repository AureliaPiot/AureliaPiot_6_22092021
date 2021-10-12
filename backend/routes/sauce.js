const express = require('express');
const router =express.Router();

const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
// verification de l'identité
const multer = require('../middleware/multer-config');
//manipulation de fichier

const test = require('../middleware/test');
// recupere la methode,le status de la requete & l'id de l'user

router.get('/',auth,sauceCtrl.getAllSauces);
router.get('/:id',auth,test,sauceCtrl.getOneSauce);


router.post('/',auth,multer,sauceCtrl.addSauce);
router.put('/:id',auth,test,multer,sauceCtrl.updateSauce);
router.delete('/:id',auth,sauceCtrl.deleteSauce);

router.post('/:id/like',auth,test,sauceCtrl.LikeSauce);

module.exports = router;


