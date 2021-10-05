const express = require('express');
// importation de express
const app =express();
// utilisation de express pour créer une application

const mongoose =require('mongoose');
mongoose.connect('mongodb+srv://P6_DB_user:BJPlzd45me@exosite.xaes9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ 
    useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
    


const userRoutes = require('./routes/user');
// on appel les routes des user( pour recupe la fin de l'url + le controller a efectuer)
const sauceRoutes = require('./routes/sauce');
const path = require('path');
// possibiliter d'enregistrer des images


// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
app.use(express.json());
// pour lire le corp de la requete

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
    next();
});


// on donner le debut de l'url, userRoutes s'occupe de redistribué en fonction de la fin de l'url
app.use('/api/auth',userRoutes);
app.use('/api/sauces',sauceRoutes);


app.use('/images', express.static(path.join(__dirname, 'images')));
// possibiliter d'enregistrer des images



module.exports =app;
// exportation de l'app