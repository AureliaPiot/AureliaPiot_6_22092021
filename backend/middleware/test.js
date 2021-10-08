const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('----------Test---------');

    console.log('methode : '+req.method);
    console.log('status : '+res.statusCode);
    // console.log('body : '+res.body);
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,'RANDOM_SECRET_TOKEN');
    const userId = decodedToken.UserId;

    console.log("test_token : "+token);
    console.log("test_userId : "+userId);
    // console.log("Requete userId : "+req.body)
    console.log("Body :");
    console.table(req.body);

    

    console.log('----------tst---------');

    
    next()
}