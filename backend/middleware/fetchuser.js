var jwt = require('jsonwebtoken');
const JWT_SECRET = "yashisgoodboy"; 

const fetchuser = (req , res , next)=>{
    // get the user form jwt token
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate." });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
        
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate." });
    }
}

module.exports = fetchuser;