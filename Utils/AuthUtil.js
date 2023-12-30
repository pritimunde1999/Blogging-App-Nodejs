const validator = require('validator');

const cleanUpAndValidate = ({name, username, email,password})=>{
    return new Promise((resolve,reject)=>{
        if(!email || !username || !name || !password) 
        {
            reject("missing credentials");
        }

        if(typeof username !== 'string') reject('Username is not a string');
        if(typeof name !== 'string') reject('Name is not a string');
        if(typeof password !== 'string') reject('Password is not a string');

        if(username.length < 2 || username.length>30) reject("username should include 3-30 characters")

        if(!validator.isEmail(email)) reject("Invalid email format");

        resolve();
    })
}

module.exports = {cleanUpAndValidate};