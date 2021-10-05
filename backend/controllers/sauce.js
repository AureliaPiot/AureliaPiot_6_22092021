const Sauce =require('../models/Sauce' );



// get all
exports.getAllSauces = (req, res, next )=>{
    Sauce.find()
    .then(Sauces => res.status(200).json(Sauces))
    .catch(error => res.status(400).json(error));
};

// get One
exports.getOneSauce = (req, res, next)=>{
    Sauce.findOne({_id: req.params.id })
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({error}));
};


exports.addSauce = (req,res,next)=>{
    // possibliter d'ajout des fichiers

    // on transforme cette chaine de caractere (le sauce du corps de la requet) pour la transformer en objet javascripte
    const sauceObject = JSON.parse(req.body.sauce);
    
    delete sauceObject._id;

    //car sauceObject contient le body de la requete

    const sauce =new Sauce({
        ...sauceObject,
        // tout le corp de la requete
        // comme c'est le middleware multer qui a generer l'url de l'image, on modife l'url de l'image de la requete recus ici pour pour avoir l'enregistrer dans la base de donnée
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        // req.protocol = correspond a HTTP ou HTTPS
        // ${req.get('host')} = host de notre server (ici localhost:3000)
        //images = le dossier ou se trouve les images
        // req.file.filename = ici on a le nom du fichier
    });
    console.log(sauce);
    sauce.save()
        .then(()=> res.status(201).json({message:"objet enregistrer"}))
        .catch(error => res.status(400).json({error}));
};



