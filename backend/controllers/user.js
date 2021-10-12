const User =require('../models/User');
// importation du model pour y lire les infos

// installation et importation de bcrypt  pour crypter le mot de passe
const bcrypt =require('bcrypt');

// installation et importation de jwt pour crypter le token 
const jwt = require('jsonwebtoken');


// inscription
exports.signup = (req, res, next)=>{
    // faire la regex
    const regexEmail =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(req.body.password);
    console.log(regexEmail);
    
    if(req.body.password && regexEmail){
        bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            const user = new User({ //utilisation du model creer et importer
                email:req.body.email,
                password : hash,
                date : Date.now()
            });
            user.save() //enregistrement de cette objet creer avec le model
                .then(()=> res.status(201).json({message : 'utilisateur créé'}))
                .catch(error => res.status(403).json({ error:"creation utilisateur impossible" }));
        })
        .catch(error => res.status(500).json({ error }))
    }
    else{
        res.status(400).json({ message : "mot de passe invalide , il doit comporter au moins huit caractères, une lettre, un chiffre et un caractère spécial" })
    }

};


// connexion
exports.login = (req, res, next)=>{
    User.findOne({email: req.body.email})
    .then(User => {
        console.log('user:'+User);
        if(!User){
            return res.status(401).json({error:'utilisateur inexistant'})
        }
        bcrypt.compare(req.body.password, User.password)
    .then(valid => {
        console.log('user valide:'+ valid);
        if(!valid){
            return res.status(401).json({error:'mot de passe incorrect'})
            }
        res.status(200).json({
            userId: User._id,
            token: jwt.sign(
                { userId:User._id },
                process.env.TOKEN,
                { expiresIn: '24h' }
            )
        });
    })
    .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
}
