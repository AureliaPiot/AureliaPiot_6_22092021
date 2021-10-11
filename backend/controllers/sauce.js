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

    // on transforme cette chaine de caractere (le sauce du corps de la requete) pour la transformer en objet javascript

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    console.log("userId "+userId);


    const sauceObject = JSON.parse(req.body.sauce);
    console.log("objet sauce "+sauceObject);

    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        // tout le corp de la requete

        // comme c'est le middleware multer qui a generer l'url de l'image, on modife l'url de l'image de la requete recus ici pour pour avoir l'enregistrer dans la base de donnée
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,


        // req.protocol = correspond a HTTP ou HTTPS
        // ${req.get('host')} = host de notre server (ici localhost:3000)
        //images = le dossier ou se trouve les images
        // req.file.filename = ici on a le nom du fichier

    });
    console.log('sauce '+sauce);
    sauce.save()
        .then(()=> res.status(201).json({message:"sauce enregistrée"}))
        .catch(error => res.status(400).json({error:"la sauce n'a pas pu etre enregistrer"}));
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////

// [UPDATE]
exports.updateSauce = (req, res, next)=>{
    // faire une condition qui supprime l'image precedante

    const sauceObject = req.file ?
    // initialisation de sauceObject avec une condition
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };

    //   si il existe on aura un type d'objet
    //   -> on prend le fichier en compte , donc on recupere toute les information (avec "...") sous forme d'objet js (avec JSON.parse) le corp de la requete, et on va egalement generer l'imageURL
    //   si il n'existe pas, on aura un autre type d'objet
    //   -> on fait une simple copie de req.body =": { ...req.body };"

    Sauce.updateOne({_id: req.params.id },
         {...sauceObject, _id: req.params.id})
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
const jwt = require('jsonwebtoken');

// [LIKES]
exports.LikeSauce = (req, res, next)=>{

    console.log('---middleware like---');
    const userId = req.body.userId;
    const likeStatus = req.body.like;


    switch (likeStatus){
        case 1:
        console.log('Lke_UserId'+ userId);

            Sauce.findOne({_id: req.params.id})
                .then(sauce =>{   

                    if(!sauce.usersDisliked.includes(`${userId}`) ){
                        console.log("like ajouté"); 

                        sauce.usersLiked.push(`${userId}`);
                        sauce.likes ++;
                        sauce.save()
                            .then(()=> 
                            res.status(200).json({message:"sauce liké"})
                            )
                            .catch(error => res.status(400).json({error:"la sauce n'a pas pu etre être liké "}));

                        }
                    else{
                        return res.status(400).json({error:"la sauce n'a pas pu etre être liké "})
                    }
             

            })
            .catch(error => res.status(500).json({message : 'error - like'}));
        
            break; 

        case -1:
            Sauce.findOne({_id: req.params.id})
                .then(sauce =>{

                    if(!sauce.usersLiked.includes(`${userId}`) ){
                        console.log(" dislike ajouté" ); 

                        sauce.usersDisliked.push(`${userId}`);
                        sauce.dislikes ++;
                        sauce.save()
                            .then(()=> 
                            res.status(200).json({message:"sauce dislike"})
                            )
                            .catch(error => res.status(400).json({error:"la sauce n'a pas pu etre être dislike "}));

                        }
                    else{
                        return res.status(400).json({error:"la sauce n'a pas pu etre être liké "})
                    }
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

