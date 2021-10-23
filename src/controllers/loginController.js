const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado')
    console.log(req.session.user)
        res.render('login')
}

//REGISTER

exports.register = async (req, res) => {
    try{
        const login = new Login(req.body)
        await login.register();
    
        if(login.errors.length > 0 ) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                res.redirect('/login/index')
            })
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso');
        req.session.save(function() {
           return res.redirect('/login/index')
        })
    } catch(e) {
        console.log(e)
       return res.render('404')
    }
}

//LOGIN

exports.login = async (req, res) => {
    try{
        const login = new Login(req.body)
        await login.login();
    
        if(login.errors.length > 0 ) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                res.redirect('/login/index')
            })
            return;
        }

        req.flash('success', 'Você logou com sucesso');
        req.session.user = login.user;
        req.session.save(function() {
           return res.redirect('/login/index')
        })
    } catch(e) {
        console.log(e)
       return res.render('404')
    }
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/login/index')
}