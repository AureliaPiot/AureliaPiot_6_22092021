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
    

app.use(express.json());




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


const userRoutes = require('./routes/user');
// on appel les routes des user( pour recupe la fin de l'url + le controller a efectuer)

app.use('/api/auth',userRoutes);
// on donner le debut de l'url, userRoutes s'occupe de redistribué en fonction de la fin de l'url



module.exports =app;
// exportation de l'app