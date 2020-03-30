var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('dangky', new LocalStrategy({
        passReqToCallback : true,
        usernameField: 'email',
        passwordField: 'password',
      },
      function(req, email,password, done) {
        findOrCreateUser = function(){
          User.findOne({'email':email},function(err, user) {
            if (err){
              console.log('Lỗi khi đăng ký'+err);
              return done(err);
            }
            if (user) {
              console.log('Người dùng đã tồn tại');
              return done(null, false, 
                 req.flash('message','Người dùng đã tồn tại'));
            } else {
              var newUser = new User();
              newUser.username = req.param('username');
              newUser.password = newUser.generateHash(password);
              newUser.email = email;
              newUser.phone = req.param('phone');
              newUser.address = req.param('address');
              newUser.save(function(err) {
                if (err){
                  console.log('lỗi đăng kí: '+err);  
                  throw err;  
                }
                console.log('đăng kí thành công');    
                return done(null, newUser);
              });
            }
          });
        };
         
        process.nextTick(findOrCreateUser);
    }));
    passport.use('dangnhap', new LocalStrategy({
        usernameField: 'email',

        passReqToCallback: true
    },
    function (req, email, password, done) {
        User.findOne({'email': email}, function (err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'không tìm thấy email'));
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'sai mật khẩu')); 

            return done(null, user);
        });

    })
    )
   

};
