module.exports = (req, res, next) => {

    console.log('methode : '+req.method);
    console.log('status : '+res.statusCode);
    console.log('body : '+res.body);

    // console.log(JSON.stringify(req.headers));
    // console.log('token : '+req.headers.authorization.split(" ")[1]);

    
    next()
}