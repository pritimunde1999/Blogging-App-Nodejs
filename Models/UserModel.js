const userSchema = require('../Schemas/UserSchema');
const bcrypt = require('bcrypt');

let User = class{
    username;
    email;
    name;
    password;

    constructor({username,email,name,password})
    {
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password
    }

    //NON-STATIC Method
    //require to craeet object for it..and pass all the argumemts used in constructor 
    registerUser(){
        return new Promise(async(resolve ,reject)=>{
            console.log(this.password,process.env.SALT)
            const hashedPassword = await bcrypt.hash(this.password, parseInt(process.env.SALT))

            const userObj = new userSchema({
                name: this.name,
                email : this.email,
                password : hashedPassword,
                username : this.username
            })

            try{
                const userDb = await userObj.save();
                resolve(userDb);
            }
            catch(err){
               reject(err) 
            }
        });
    }



    //STATIC Method
    //can call directly with class name .. no need to create objcet
    static finUsernameAndEmailExists({email,username}){
        return new Promise((resolve,reject)=>{
            try{
                const userExist = userSchema.findOne({
                    $or : [{email},{username}]
                })

                if(userExist && userExist.email === email)
                {
                    reject("Email already exists")
                }

                if(userExist && userExist.username === username)
                {
                    reject("username already exists")
                }

                resolve();
            }
            catch(err){
                reject(err)
            }
        })
    }


    static findUserEmailOrUsername({loginId}){
        return new Promise(async(resolve,reject)=>{
            try{
                const userDb = await userSchema.findOne({
                    $or : [{email : loginId},{username:loginId}]
                })

                if(!userDb) reject('User not registered.. Please register first')
                
                resolve(userDb)
            }
            catch(err){
                reject(err)
            }
        })
    }
}

module.exports = User;