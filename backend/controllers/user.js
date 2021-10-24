const User =require('../models/User');
// importation du model pour y lire les infos

// installation et importation de bcrypt  pour crypter le mot de passe
const bcrypt =require('bcrypt');

// installation et importation de jwt pour crypter le token 
const jwt = require('jsonwebtoken');

// installation et importation de crypto pour crypter l'email 
const crypto = require('crypto-js');

// ////////////////////////////////////////////////////////////////////////////////////////////////////

// [inscription]
exports.signup = (req, res, next)=>{
    // faire la regex
    const regexPassword =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(req.body.password);
    console.log(regexPassword);
    
    if(req.body.password && regexPassword){

        const email=crypto.AES.encrypt(req.body.email,crypto.enc.Utf8.parse(process.env.SELMAIL),{ iv: crypto.enc.Base64.parse(process.env.CRYPTOPARSE) }).toString();
        

        let date= Date.now();

        bcrypt.hash(date + req.body.password + process.env.SEL,10)
        .then(hash =>{
            const user = new User({ //utilisation du model creer et importer
                email:email,
                password : hash,
                date : date
            });
            user.save() //enregistrement de cette objet creer avec le model
                .then(()=> res.status(201).json({message : 'utilisateur créé'}))
                .catch(error => res.status(403).json({ error:"creation utilisateur impossible" }));
        })
        .catch(error => res.status(500).json({ error }))
        }

    else{
        res.status(400).json({ message : "mot de passe invalide, il doit comporter au moins huit caractères, une lettre, un chiffre et un caractère spécial" })
    }

};


// ////////////////////////////////////////////////////////////////////////////////////////////////////

// [connexion]
exports.login = (req, res, next)=>{
    const email=crypto.AES.encrypt(req.body.email,crypto.enc.Utf8.parse(process.env.SELMAIL),{ iv: crypto.enc.Base64.parse(process.env.CRYPTOPARSE) }).toString();


    User.findOne({email:email})
    .then(User => {
        console.log('user:'+ User);
        if(!User){
            return res.status(401).json({error:'utilisateur inexistant'})
        }

        bcrypt.compare(User.date + req.body.password + process.env.SEL ,User.password)
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
