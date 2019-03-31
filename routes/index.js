var express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/user.js');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('261197Ai9ol1Yp0Qt5c57ef2f', 'Otp for your registration is {{otp}}, please do not share it with anybody');
session = require('express-session');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    currentUser: req.user
  });
});

router.get('/users/:id', function(req, res) {
  res.render("user_details", {
    currentUser: req.user
  })
})


/*GET Edit details page */
router.get('/users/:id/edit', function(req, res) {
  res.render("edit", {
    currentUser: req.user
  })
})

router.put("/users/:id", function(req, res) {
  // find and update the correct user details
  console.log(req.body)
  User.findByIdAndUpdate(req.params.id, {
    $set: {
      fullname: req.body.fullname,
      phone: req.body.phone,
      username: req.body.username
    }
  }, function(err, Users) {
    if (err) {
      console.log(req.body)
      //res.redirect("/users" + req.params.id);
    } else {
      //redirect somewhere(show page)

      res.redirect("/")
    }
  });
});



/* GET register page */
router.get('/register', function(req, res) {
  res.render('register');
});

/*Adding new user to the database */
router.post('/register', function(req, res) {
  User.register(new User({
    fullname: req.body.fullname,
    phone: req.body.phone,
    username: req.body.username
  }), req.body.password, function(err, user) {
    if (err) {
      console.log(err)
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        const mobileNo = "91" + req.body.phone
        //Storing users mobile number into express-session to use this in different routes.catch
        //Once the user closes the site, the data in the session will be lost.
        req.session.phone = req.body.phone;
        //OTP varification - Sending OTP to the users
        sendOtp.send(mobileNo, "PRIIND", function(error, data) {
          console.log(data);
        });
        res.redirect('/verify_otp');
      });
    }
  });
});

/* GET OTP Verification routes */
router.get('/verify_otp', function(req, res) {
  res.render('verify')
});

/* Verification of USER's OTP */
router.post('/verify_otp', function(req, res) {
  sendOtp.verify("91" + req.session.phone, req.body.otp, function(error, data) {
    console.log(data); // data object with keys 'message' and 'type'
    //SuccessFull redirection will be send to the homepage
    //failure redirection will be send to the OTP page
    if (data.type == 'success') res.redirect('/');
    if (data.type == 'error') res.redirect('/verify_otp');
  });
});


/*GET login request */
router.get('/login', function(req, res) {
  res.render('login');
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req, res) {});


/*Forget Password */
router.get('/change_password', function(req, res) {
  res.render('change_password');
})

router.post('/change_password', function(req, res) {
  const mobile_no = "91" + req.body.phone
  req.session.phone = mobile_no;
  console.log(req.session.phone)
  sendOtp.send(req.session.phone, "PRIIND", function(error, data) {
    console.log(data);
  });
  res.redirect('/verify_changes');

})

/*OTP Verification for reset password */

/* GET OTP Verification routes */
router.get('/verify_changes', function(req, res) {
  res.render('verify_changes')
});

/* Verification of USER's OTP */
router.post('/verify_changes', function(req, res) {
  console.log(req.session.phone)
  sendOtp.verify(req.session.phone, req.body.otp, function(error, data) {
    console.log(data); // data object with keys 'message' and 'type'
    //SuccessFull redirection will be send to the homepage
    //failure redirection will be send to the OTP page
    if (data.type == 'success') res.redirect('/reset_password');
    if (data.type == 'error') res.redirect('/login');
  });
});


/* Reset Password Routes */

router.get('/reset_password', function(req, res) {
  res.render('reset_password');
})

router.post('/reset_password', function(req, res) {
  User.findByUsername(req.body.username).then(function(sanitizedUser) {
    if (sanitizedUser) {
      sanitizedUser.setPassword(req.body.password, function() {
        sanitizedUser.save();
        console.log('Password Reset SuccessFully')
        res.redirect('/login');
      });
    } else {
      console.log('The User Does not exists')
      res.redirect('/reset_password');
    }
  }, function(err) {
    console.error(err);
    res.redirect('/login');
  })
})

/*GET logout request */
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
