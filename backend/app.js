const express = require('express');
// importation de express
const app =express();
// utilisation de express pour créer une application

const crypto = require('crypto-js');
// var AES = require("crypto-js/aes");


const mongoose =require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECT,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));



const userRoutes = require('./routes/user');
// on appel les routes des user( pour recupe la fin de l'url + le controller a efectuer)
const sauceRoutes = require('./routes/sauce');
const path = require('path');
const { stringify } = require('querystring');
// possibiliter d'enregistrer des images


// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.use(express.json());
// pour lire le corp de la requete

// app.use(express.urlencoded())
// pour lire l'url de la requete


// HEADER
// appliquer à toutes les routes, permet la communication entre server
// quand le front et le back n'ont pa la meme origine
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    //toutes les origines sont accepter,tout le mondes peut interagire
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //autorisation d'utiliser certain header(en-tete)
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //autorisation d'utiliser certaines methodes (get,post..ect)
    res.set("Content-Security-Policy", "default-src 'self'");
    next();
});


// on donner le debut de l'url, userRoutes s'occupe de redistribué en fonction de la fin de l'url

app.use('/api/auth/',userRoutes);
app.use('/api/sauces/',sauceRoutes);


app.use('/images', express.static(path.join(__dirname, 'images')));
// possibiliter d'enregistrer des images

// --------------------------------------------------
// const test = crypto.AES.encrypt('key','elements').toString();
// console.log("1test " +test);
// const untest = crypto.AES.decrypt(test,'elements').toString(crypto.enc.Utf8);
// console.log("2test " +untest);

// const email= crypto.enc.Base64.stringify(crypto.SHA1(req.body.email, process.env.SELMAIL));
// CryptoJS.AES.encrypt(msg, key, { mode: CryptoJS.mode.ECB });
const test = crypto.AES.encrypt('key',crypto.enc.Utf8.parse('elements'), {iv: crypto.enc.Base64.parse(process.env.CRYPTOPARSE) }).toString();
console.log("1test " +test);

const untest = crypto.AES.encrypt('key',crypto.enc.Utf8.parse('elements'),{ iv: crypto.enc.Base64.parse(process.env.CRYPTOPARSE) }).toString();
console.log("2test " +untest);

console.log(test == untest)
// --------------------------------------------------

module.exports =app;
// exportation de l'app