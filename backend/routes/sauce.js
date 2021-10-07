const express = require('express');
const router =express.Router();

const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
// verification de l'identité
const multer = require('../middleware/multer-config');
//manipulation de fichier

const UserCtrl = require('../middleware/userCtrl.js');
//controle de l'id user et la sauce

const test = require('../middleware/test');
// recupere la methode,le status de la requete & l'id de l'user

router.get('/',auth,sauceCtrl.getAllSauces);
router.get('/:id',auth,test,UserCtrl,sauceCtrl.getOneSauce);


router.post('/',auth,multer,sauceCtrl.addSauce);
router.put('/:id',auth,multer,sauceCtrl.updateSauce);
router.delete('/:id',auth,sauceCtrl.deleteSauce);

router.post('/:id/like',test,auth,sauceCtrl.LikeSauce);

module.exports = router;


