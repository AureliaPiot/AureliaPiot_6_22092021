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
// possibiliter d'enregistrer des images


app.use(express.json());
// pour lire le corp de la requete


// HEADER
// appliquer à toutes les routes, permet la communication entre server
// quand le front et le back n'ont pas la meme origine
app.use((req,res,next)=>{
    if(req.headers.origin === 'http://localhost:8081' || req.headers.origin === 'http://127.0.0.1:8081' ){
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.set("Content-Security-Policy", `default-src 'self' ${req.headers.origin}`);
    }
    // seul deux origines sont acceptée, seul le Front peut envoyer des requetes au back

    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //autorisation d'utiliser certain header(en-tete)
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //autorisation d'utiliser certaines methodes (get,post..ect)
    next();
});


// on donner le debut de l'url, userRoutes s'occupe de redistribué en fonction de la fin de l'url

app.use('/api/auth/',userRoutes);
app.use('/api/sauces',sauceRoutes);


app.use('/images', express.static(path.join(__dirname, 'images')));
// recupere l'image avec l'url recuperer de imageUrl d'une sauce



module.exports =app;
// exportation de l'app