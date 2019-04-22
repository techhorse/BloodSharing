var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    User = require("./models/user"),
     springedge = require('springedge'),
     datetime=require('node-datetime'),
     moment = require('moment'),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
const puretext = require('puretext');
const fileUpload = require('express-fileupload');
   

   
   
//mongoose.connect("mongodb://localhost/BloodShare");

mongoose.connect("mongodb://sangyrao:abhi199718@ds015942.mlab.com:15942/bloodshare");
var app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
//SCHEMA SETUP
var Schema = new mongoose.Schema({
    username: String,
    City: String,
    Blood: String,
    Age: Number,
    Weight:Number,
    Dated:String,
    Address: String,
    District: String,
    Mobile: Number,
    Email: String,
    optradio: String,
    Fresher: String,


});
var Users = mongoose.model("users", Schema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(require("express-session")({
    secret: "abhishek and sangeeta",
    resave: false,
    saveUninitialized: false
}));
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "projectlifeshare@gmail.com",
        pass: "abhi199718"
    }
});

app.use(passport.initialize());
app.use(passport.session());

var val = Math.floor(1000 + Math.random() * 9000);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.post("/Profile", function(req, res) {
    var mailOptions = {
        from: "BloodShare✔ <projectlifeshare@gmail.com>", // sender address
        to: "projectlifeshare@gmail.com", // list of receivers
        subject: "Blood Requirement✔", // Subject line
        text: "Blood Needed✔", // plaintext body
        html: req.body.city + "\n" + req.body.Blood // html body
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Message sent: " + response.message);
        }
    });

    /*let text = {
          // To Number is the number you will be sending the text to.
          toNumber: '+91-977-724-8021',
          // From number is the number you will buy from your admin dashboard
          fromNumber: '+1-920-345-5633',
          // Text Content
          smsBody: 'Sending SMS using Node.js',
          //Sign up for an account to get an API Token
          apiToken: 'xncd6i'
      };

      puretext.send(text, function (err, response) {
        if(err) console.log(err);
        else console.log(response)
      })

    */

    Users.find({ "City": req.body.city, "Blood": req.body.Blood }, function(err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("Profile", { users: docs })
        }
    });
});


app.post('/upload', function(req, res) {
  // Uploaded files:
  console.log(req.files.my_profile_pic.name);
});




/*app.post("/sangy",function(req,res){
  

/*let text = {
      // To Number is the number you will be sending the text to.
      toNumber: '+91-977-724-8021',
      // From number is the number you will buy from your admin dashboard
      fromNumber: '+1-920-345-5633',
      // Text Content
      smsBody: 'Sending SMS using Node.js',
      //Sign up for an account to get an API Token
      apiToken: 'xncd6i'
  };

  puretext.send(text, function (err, response) {
    if(err) console.log(err);
    else  res.redirect("Portfolio")
  })



*/

/*
var springedge = require('springedge');
var params = {
  'apikey': '64wn986xe218mp727fw439e3i9ta11a55', //API Key
  'sender': 'SEDEMO', //Test Sender
  'to': [
    '9777248021','9692380396','8839870210',  //Mobile Numberss
  ],
  'message': 'Hey Blood Donor,There is urgent need of O+ve Blood In XYZ Hospital.Please contact the ATTENDANT in Provided number :+91-xxxxxxxxxx....DONATE BLOOD..SAVE LIFE!!',
  'format':'json'
};
springedge.messages.send(params, 5000, function (err, response) {
  if (err) {
    return console.log(err);
  }
  console.log(response);
});
});

*/

function sendSMS(mob) {
    var params = {
        'apikey': '64wn986xe218mp727fw439e3i9ta11a55', //API Key
        'sender': 'SEDEMO', //Test Sender
        'to': [
            mob, //Mobile Numberss
        ],
        'message': 'Hey Blood Donor,There is urgent need of O+ve Blood In XYZ Hospital.Please contact the ATTENDANT in Provided number :+91-xxxxxxxxxx....DONATE BLOOD..SAVE LIFE!!',
        'format': 'json'
    };
    springedge.messages.send(params, 5000, function(err, response) {
        if (err) {
            return console.log(err);
        }
        console.log(response);
    });
}

app.get("/Login",function(req,res){
   res.render("Login");
});
app.post("/info", function(req, res) {
    Users.find({}, function(err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            // send the sms. result
            docs.forEach(function(user) {
                console.log('Sending sms to: ' + user.Mobile);
               
                sendSMS(user.Mobile);
                 //req.flash("success", "You have Sucessfully Signed Up!!!");
                 
            });
            res.render("info", { users: docs });
        }
    });
});



app.get("/home", function(req, res) {
    res.render("home");
});

app.get("/Portfolio", function(req, res) {
    Users.find({}, function(err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("Portfolio", { users: docs });

        }
    });
});
app.get("/", function(req, res) {
    res.render("home");
});


app.get("/About", function(req, res) {
    res.render("About");
});
app.get("/Contact", function(req, res) {
    res.render("Contact");
});
app.get("/donor", function(req, res) {
    
    res.render("donor", { currentUser: req.user });
});




app.get("/donor",isLoggedIn,function(req,res){
   res.render("donor"); 
});

app.get("/Signup", function(req, res) {
    res.render("Signup");
});
app.post("/Login",passport.authenticate("local",{
    successRedirect :"/donor",
    failureRedirect: "/Login"
    }),function(req,res){
      
});

//handling user sign up
app.post("/Signup", function(req, res) {
    if(req.body.Weight > 45  && req.body.Age >18){
    User.register(new User({
        username: req.body.username,
        optradio: req.body.optradio,
        Blood: req.body.Blood,
        Age: req.body.Age,
        Weight:req.body.Weight,
        Dated:req.body.Dated,
        Mobile: req.body.Mobile,
        Email: req.body.Email,
        Address: req.body.Address,
        City: req.body.City,
        District: req.body.District,
        optradio1: req.body.optradio1,
    }), req.body.password, function(err, user) {
        if (err) {
            req.flash("error", "Signup Failed...Please Try Again!!");
            return res.render('Signup');
        }
         passport.authenticate("local")(req, res, function(){
            
           res.redirect("/");
           req.flash("success","You have Sucessfully Signed Up!!!");
        });
        
        //});
    
    });
    }
    else{
        req.flash("error", "Signup Failed...Please Try Again!!");
            return res.redirect('/home');
    }
    
});
app.get("/Delete",function(req,res){
   res.render("Delete",{currentUser:req.user});
   });
   
  
  
   app.post("/update",function(req,res){
    var user=req.user.username;
    
    if(user == req.body.username1){
     Users.update({"Dated":req.body.cdate},function(err,docs){
       if(err){
           console.log(err);
       }else{
           req.flash("success","Your Account is successfully Updated!!");
           res.redirect("home");
       }
   }) ; 
    }
});

  
  
  
  
   
   app.post("/Delete",function(req,res){
    var user=req.user.username;
    if(user == req.body.username){
     Users.remove({"username":req.body.username},function(err,docs){
       if(err){
           console.log(err);
       }else{
           req.flash("success","Your Account is successfully Deleted!!");
           res.redirect("home");
       }
   }) ; 
    }
});






app.get("/Logout",function(req,res){
    req.logout();
    req.flash("success","Logged You out...!!!");
    res.redirect("/");
});





function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.flash("eror", "Please login First!!")
    res.redirect("/Login");
}









app.listen(process.env.PORT, process.env.IP, function() {
    console.log("LifeShare Server Started...!!");
});
