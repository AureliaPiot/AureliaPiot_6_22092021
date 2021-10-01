const express = require('express');
const router =express.Router();
// avec express, creation d'un router
const userCtrl = require('../controllers/user');
// importation des controller d'user


router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);
//segment final de l'url, le debut est indiquer dans app.js avec "app.use('/api/auth',userRoutes);"

module.exports = router;