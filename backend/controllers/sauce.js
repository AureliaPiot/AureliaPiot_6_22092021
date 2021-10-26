const Sauce =require('../models/Sauce' );
const fs = require('fs');


// [GET ALL]
exports.getAllSauces = (req, res, next )=>{
    Sauce.find()
    .then(Sauces => res.status(200).json(Sauces))
    .catch(error => res.status(400).json(error));
};
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// [GET ONE]
exports.getOneSauce = (req, res, next)=>{
    Sauce.findOne({_id: req.params.id })
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({error}));
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////

// [ADD]
exports.addSauce = (req,res,next)=>{
    // definition d'une regex pour empecher certaines injections
    const regexInput= /([<>\/{}=])+/g ;

    // on transforme cette chaine de caractere (le sauce du corps de la requete) pour la transformer en objet javascript
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    
    console.log(sauceObject);

        const sauce = new Sauce({
        ...sauceObject,
        name:   sauceObject.name.replaceAll(regexInput, "_"),
        manufacturer:   sauceObject.manufacturer.replaceAll(regexInput, "_"),
        mainPepper:     sauceObject.mainPepper.replaceAll(regexInput, "_"),
        description:    sauceObject.mainPepper.replaceAll(regexInput, "_"),
        imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            
        });
        sauce.save()
        .then(()=> res.status(201).json({message:"sauce enregistrée"}))
        .catch(error => res.status(400).json({error:"la sauce n'a pas pu etre enregistrer"}));
 
};
    
    // ////////////////////////////////////////////////////////////////////////////////////////////////////

    // [UPDATE]
    exports.updateSauce = (req, res, next)=>{
        const regexInput= /([<>\/{}=])/g;

        const sauceObject = req.file ?
        // initialisation de sauceObject avec une condition
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    // on addapte le type d'objet suivant le format de la requete (depandant de la presence d'un fichier)
    // on test les inputs
        console.log(sauceObject);
   
            console.log("file : "+req.file);
            if(req.file !== undefined){
                Sauce.findOne({_id: req.params.id})
                .then(sauce =>{
                    const filename = sauce.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`,()=>{
                        console.log("file remplacé ");                
                    });
                })
                .catch(error => console.log('echec suppression fichier'));
            }
            //si un fichier est present dans la requete, on supprime l'ancien fichier
            
            Sauce.updateOne({_id: req.params.id },

                {...sauceObject,
                 _id: req.params.id,
                name:   sauceObject.name.replaceAll(regexInput, "_"),
                manufacturer:   sauceObject.manufacturer.replaceAll(regexInput, "_"),
                mainPepper:     sauceObject.mainPepper.replaceAll(regexInput, "_"),
                description:    sauceObject.mainPepper.replaceAll(regexInput, "_")
                })
                .then(()=> res.status(200).json({message: 'sauce modifiée'}))
                .catch(error => res.status(404).json({error}));
        };
    


// ////////////////////////////////////////////////////////////////////////////////////////////////////

// [DELETE]
exports.deleteSauce = (req, res, next)=>{

    Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
        const filename = sauce.imageUrl.split("/images/")[1];
        // on recupe le nom de l'image
        console.log('images/'+filename);

        fs.unlink(`images/${filename}`,()=>{
            Sauce.deleteOne({_id: req.params.id })
            .then(() => res.status(200).json({message: 'sauce supprimée'}))
            .catch(error => res.status(404).json({error}));
        });
        // du package fs, unlink permet de supprimer un fichier
        // une fois le fichier supprimer, on va supprimer le produit de la base
    }
    )
    .catch(error => res.status(500).json({error}));

}

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// const jwt = require('jsonwebtoken');

// [LIKES]
exports.likeSauce = (req, res, next)=>{

    console.log('---middleware like---');
    const userId = req.body.userId;
    const likeStatus = req.body.like;


    switch (likeStatus){
        case 1:
        console.log('Lke_UserId'+ userId);

            Sauce.findOne({_id: req.params.id})
                .then(sauce =>{   

                        console.log("like ajouté"); 

                        sauce.usersLiked.push(`${userId}`);
                        sauce.likes ++;
                        sauce.save()
                            .then(()=> 
                            res.status(200).json({message:"sauce liké"})
                            )
                            .catch(error => res.status(400).json({error:"la sauce n'a pas pu etre être liké "}));           
            })
            .catch(error => res.status(500).json({message : 'error - like'}));
        
            break; 

        case -1:
            Sauce.findOne({_id: req.params.id})
                .then(sauce =>{

                        console.log(" dislike ajouté" ); 
                        sauce.usersDisliked.push(`${userId}`);
                        sauce.dislikes ++;
                        sauce.save()
                            .then(()=> 
                            res.status(200).json({message:"sauce dislike"})
                            )
                            .catch(error => res.status(400).json({error:"la sauce n'a pas pu etre être dislike "}));
            })
            .catch(error => res.status(500).json({message : 'error - dislike'}));
        break;     


        case 0:
            Sauce.findOne({_id: req.params.id})
                .then(sauce =>{
                    if(sauce.usersDisliked.includes(userId)){
                        console.log(" dislike retiré" ); 

                        sauce.usersDisliked.pull(`${userId}`);
                        sauce.dislikes --;
                        sauce.save()
                            .then(()=> res.status(200).json({message:"sauce plus disliké"}))
                            .catch(error => res.status(400).json({error:"la sauce n'a pas pu etre être dé-disliké "}));
                    };
                    if(sauce.usersLiked.includes(userId)){
                        console.log(" like retiré" ); 

                        sauce.usersLiked.pull(`${userId}`);
                        sauce.likes --;
                        sauce.save()
                            .then(()=> res.status(200).json({message:"sauce plus liké"}))
                            .catch(error => res.status(400).json({error:"la sauce n'a pas pu etre être de-liké "}));
                    };

                })
                .catch(error => res.status(500).json({message : 'error - un-like'}));    
        break;     
    }
    




}

