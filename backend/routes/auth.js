const express = require('express');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
var jwt = require('jsonwebtoken');

const JWT_SECRET = "yashisgoodboy"; 


// Route : 1 create a user using :POST "/api/auth/createuser". doesn't require auth

router.post('/createuser',[
    body('name','enter the valid name').isLength({min : 3}),
    body('email','enter the valid email').isEmail(),
    body('password','password must be atlest 5 charactors').isLength({min : 5}),
],
    async (req, res) => {
        // if there are error return bad request and the error
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }
        //check wherther the user with email exist already
        try {
        let user = await User.findOne({email: req.body.email});
        if(user){
            console.log(user)
            return res.status(400).json({error : "user already exist"});
            }
            // create a new user
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password,salt);

         user = await User.create({
            name : req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user :{
                id : user.id,
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        let success = true;
      return res.json({success, authToken });
        // res.json(user)

    } catch (error) {
        console.error(error.message);
    res.status(500).send("Error creating user");
    }
           
})

/// ...

// Route : 1  Authenticate a user using POST "/api/auth/login" is no login require
router.post('/login', [
    body('email', 'enter the valid email').isEmail(),
    body('password', 'password cannot be blank ').exists(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Please enter correct email' });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: 'Invalid password Please correct password' });
      }
  
      const data = {
        user: {
          id: user.id,
        },
      };
  
      const authToken = jwt.sign(data, JWT_SECRET);
      let success = true;
      return res.json({success, authToken });
    
    }
     catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // ...

//  Route : 3 get login user Details using POST "api/auth/getuser" login required
router.post('/getuser', fetchuser, async (req, res) => {



try {

  let  userId = req.user.id;
 const user = await User.findById(userId).select("-password");
 res.send(user);


} catch(error)  {
    console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
}
});

module.exports = router;