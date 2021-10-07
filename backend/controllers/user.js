const User =require('../models/User');
// importation du model pour y lire les infos

// installation et importation de bcrypt  pour crypter le mot de passe
const bcrypt =require('bcrypt');

// installation et importation de jwt pour crypter le token 
const jwt = require('jsonwebtoken');


// inscription
exports.signup = (req, res, next)=>{
    bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            const user = new User({ //utilisation du model creer et importer
                email:req.body.email,
                password : hash
            });
            user.save() //enregistrement de cette objet creer avec le model
                .then(()=> res.status(201).json({message : 'utilisateur créé'}))
                .catch(error => res.status(403).json({ error:"creation utilisateur impossible" }));
        })
        .catch(error => res.status(500).json({ error }))
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
        console.log('valide:'+ valid);
        if(!valid){
            return res.status(401).json({error:'mot de passe incorrect'})
            }
        res.status(200).json({
            UserId: User._id,
            token: jwt.sign(
                { UserId: User._id },
                'RANDOM_SECRET_TOKEN',
                { expiresIn: '24h' }
            )
        });
    })
    .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
}
