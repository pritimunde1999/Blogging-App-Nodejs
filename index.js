const express = require('express');
require('dotenv').config();
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session)

//file-imports
require('./db')
const AuthRouter = require('./Controllers/AuthController');



//constants
const app = express();
const PORT = process.env.PORT;
const store = new mongoDbSession({
    uri : process.env.MONGO_URI,
    collection : "sessions"
})



//middlewares
app.use(express.json());
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave : false,
        saveUninitialized : false,
        store : store
    })
)

app.get('/',(req,res)=>{
    res.send("Hello World!");
})

//Routes 
app.use('/auth',AuthRouter)

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})