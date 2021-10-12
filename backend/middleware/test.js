const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('----------Test---------');

    console.log('methode : '+req.method);
    console.log('status : '+res.statusCode);
    // console.log('body : '+res.body);
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,process.env.TOKEN);
    const userId = decodedToken.userId;



    console.log("token : "+token);
    console.log("userId : "+userId);

    console.log("Body :");
    console.table(req.body);

    console.log('----------tst---------');

    
    next()
}