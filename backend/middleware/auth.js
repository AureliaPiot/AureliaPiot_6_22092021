// a ajouter sur les routes où on a besoin de controller l'utilisateur
const jwt = require('jsonwebtoken');
// pour verifier les tokens

module.exports = (req, res, next) => {
  try {
    //  recuperation du token dans le header authorization,
    const token = req.headers.authorization.split(' ')[1];

    // ensuite on decode le token, avec les package jwt et sa fonction verify()
    const decodedToken = jwt.verify(token,process.env.TOKEN);
    // si erreur , on tombe dans le catch

    // extraction de l'userId
    const userId = decodedToken.userId;

    // si l'userId existe mais  qu'il est different de celui de la requete alors
    if (req.body.userId && req.body.userId !== userId) {
    console.log('erreur');

    // on envois une erreur
      throw 'Invalid user ID';

    } else {
    // sinon on passe la lecture du code au middleware suivant
      next();
    }
  } catch(error) {
    res.status(401).json({ error: error | 'Requete non authentifiée !'});
    console.log('User non authentifiée');
  }
  

};
// try and catch, car plusieurs elements peuvent posé probleme qui seront géré avec try/catch
// catch renvoie juste une erreur 401 qui correspond a un probleme d'authentifications