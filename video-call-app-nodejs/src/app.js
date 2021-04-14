const express = require( "express" );
const app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './ws/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );
const session=require("express-session");
const flash= require("connect-flash");

//const express = require("express");
//const path=require("path");
//const app=express();
const hbs=require("hbs");
//const bcrypt= require("bcryptjs");
require("./db/conn");
const Register=require("./models/registers");
const Meeting=require("./models/meetings");
const port=process.env.PORT || 3000;

//const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(session({
    secret: "secret",
    cookie: { maxAge: 60000},
    resave: false,
    saveUninitialized: false
 
 }));
 app.use(flash());
 app.use((req,res,next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
 })

app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
//app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

app.get("/",(req,res) => {
    res.render("index1")

});

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

// app.get("/meeting",(req,res)=>{
//     res.render("meeting");
//})

app.get("/index.html",(req,res)=>{
    res.sendFile( __dirname + '/index.html' );
})

//  app.post( '/meeting', ( req, res ) => {
//      res.sendFile( __dirname + '/index.html' );
//  } );

// app.get( '/meeting', ( req, res ) => {
//      res.sendFile( __dirname + '/index.html' );
//  } );

// app.post( '/login', ( req, res ) => {
//      res.sendFile( __dirname + '/index.html' );
//  } );

// app.get( '/login', ( req, res ) => {
//     res.sendFile( __dirname + '/index.html' );
// } );
app.post("/register", async (req,res)=>{
    try {
        let password=req.body.password;
        let cpassword=req.body.cpassword;

        if(password  === cpassword){
            const registeruser=new Register({
                username:req.body.username,
                email:req.body.email,
                password:password,
                cpassword:cpassword
            })
           
            const register= await registeruser.save();
            
            res.status(201).redirect("/login");
            

        }else {
            req.session.message = {
                type: 'danger',
                intro: 'Passwords are not matching',
                message: 'Please insert same passwords'
            }
            res.redirect('/register');
           // res.send("passwords are not matching");
        }

        
       
    }catch (error) {
        req.session.message = {
            type: 'danger',
            intro: 'Email already registered!',
            message: 'Please signin....'
        }
        res.redirect('/register');
        //res.status(404).send(error);
    }

})
/*app.get("/",(req,res) => {
    res.render("style")

});*/

app.post("/login",async (req,res)=>{
    try {
        const email=req.body.emailid;
        const password=req.body.password1;

        const usermail=await Register.findOne({email:email});

        if(usermail.password === password){
            res.status(201).redirect("/index.html");
        }else{
            req.session.message = {
                type: 'danger',
                intro: 'Passwords are not matching',
                message: 'Please insert same passwords'
            }
            res.redirect('/login');
           // res.send("password are not matching");
        }

       

    }catch (error) {
        req.session.message = {
            type: 'danger',
            intro: 'INVALID EMAIL',
            message: 'Please SIGNUP...'
        }
        res.redirect('/login');
        //res.status(404).send("Invalid Email. Please Signup");
        //res.status(201).render("register");

    }
})

app.post("/index", async (req, res) => {
    try {
        let roomname = req.body.roomname;
        let username = req.body.username;
        let date = req.body.date;
      //  let time = req.body.time;


        const meetinguser = new Meeting({
            roomname: req.body.roomname,
            username: req.body.username,
            date: req.body.date
           // time: time
        })


        const meeting = await meetinguser.save();

    }catch (error) {
        console.log(error);
    }

})

io.of( '/stream' ).on( 'connection', stream );

server.listen( 3000 );
