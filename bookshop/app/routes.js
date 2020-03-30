let user = require('./models/user');
var express = require('express');
var router = express.Router();

module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });
    app.get('/dangnhap', function (req, res) {
        res.render('dangnhap.ejs', {message: req.flash('loginMessage')});
    });
    app.get('/dangky', function (req, res) {
        res.render('dangky.ejs', {message: req.flash('signupMessage')});
    });
    app.get('/quanly', isLoggedIn, function (req, res) {
        res.render('quanly.ejs', {
            user: req.user 
        });
    });
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
    app.post('/dangky', passport.authenticate('dangky', {
        successRedirect: '/quanly', 
        failureRedirect: '/dangky',
        failureFlash: true 
    }));
        app.post('/dangnhap', passport.authenticate("dangnhap", {
            successRedirect : '/quanly',
            failureRedirect : '/dangnhap',
            failureFlash : true
        }));

        
        
        app.get('/edit/:id',isLoggedIn, function(req, res,next) {
            console.log(req.params.id);
            user.findById(req.params.id, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
        
                    res.render('updateuser', { user: data });
                }
            });
        });
        
        app.post('/edit/:id',isLoggedIn, function(req, res,next) {
            user.findById({ _id : req.params.id }, function(err, user) {
    
                if(err) return next(err);
                if (!user) return next();
                user.username = req.body.username;
         
                user.address = req.body.address;
         
                user.phone = req.body.phone;
         
                user.password = user.generateHash(req.body.password);
         
                user.save(function(err, user) {
                    if(err) return next(err);
                    if(!user) return next();
                    res.render('quanly', { user: user });
                });
            });
        });
        app.get('/delete/:id',isLoggedIn, function(req, res) {
            user.findByIdAndRemove(req.params.id, function (err, project) {
              if (err) {
              
              res.redirect('../quanly');
              } else {
                
                res.redirect('../dangnhap');
              }
            });
          });
  
};