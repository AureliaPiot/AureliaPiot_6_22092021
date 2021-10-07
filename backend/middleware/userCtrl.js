const jwt = require('jsonwebtoken');
const Sauce =require('../models/Sauce' );

module.exports = (req, res, next) => {
  console.log("----------UserCtrl-----------------------");

    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,'RANDOM_SECRET_TOKEN');
    const userId = decodedToken.UserId;
    console.log("userId : "+userId);
    // console.log("sauceId : "+req.body.sauce);    


    Sauce.findOne({_id: req.params.id })
    .then(Sauce =>{
      console.log("Sauce : "+Sauce);    
        if(Sauce.userId === userId){
          console.log('c est bien le meme createur')
          next()
        }
        else{
          next()
          console.log('c est pas le meme createur')

          // res.status(404).json({error});
        }



      
    })
    .catch(error => res.status(404).json({error}));




  console.log("----------UserCtrl-----------------------");

}