const bcrypt = require('bcryptjs')
const secret = 'abcd'
const jwt = require('jsonwebtoken');

async function hashing(value) {
    const salt = await bcrypt.genSalt(10)
    let result = await bcrypt.hash(value, salt)
    return result
}

const hashCompare = async(password, hashValue)=>{
    try {
        return await bcrypt.compare(password, hashValue)
    } 
    catch (error) {
        return error
    }
}

const createJWT = async({email, id})=>{
    return await jwt.sign(
        {
        email,id
        }, 
        secret,
        { expiresIn: '1h' });
}
module.exports = {hashing, hashCompare, createJWT}