require('dotenv').config();
const jwt = require('jsonwebtoken')

const secrete = process.env.SECRETE

// create jwt token
const createToken = (id,fb)=>{
    return jwt.sign({userId:id,isFb:fb},secrete,{expiresIn:'1d'})
}

module.exports = createToken;
