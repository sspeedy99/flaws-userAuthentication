var express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{currentUser:req.user});
});

/* GET register page */
router.get('/register',function(req,res) {
  res.render('register');
});

/*Adding new user to the database */
router.post('/register',function(req,res){
  User.register(new User({fullname:req.body.fullname,phone:req.body.phone,username:req.body.username}), req.body.password, function(err,user){
    if(err) {
      console.log(err)
       res.redirect("/register");
    } else {
      passport.authenticate("local")(req,res,function(){
         //console.log(user);

      res.redirect("/");
      });
    }
  });
});

/*GET login request */
router.get('/login',function(req,res) {
  res.render('login');
});

router.post("/login",passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"}),function(req,res){
});

/*GET logout request */
router.get("/logout",function(req,res){
  req.logout();
  res.redirect('/');
});


module.exports = router;
