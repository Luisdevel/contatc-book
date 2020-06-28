const Login = require('../models/LoginModel');

exports.index = (request, response) => {
    console.log(request.session.user);
    if(request.session.user) return response.render('login-logado');
    response.render('login');
};

// Cadastra o usuário
exports.register = async (request, response) => {
    try {
        const login = new Login(request.body);
        await login.register();
    
        if(login.errors.length > 0) {
            request.flash('errors', login.errors);
            request.session.save(() => response.redirect('back'));
            return;
        };
    
        request.flash('success', 'Seu usuário foi cadastrado!');
        request.session.save(() => response.redirect('back'));
        return;
    } catch(e) {
        console.log(e);
        return response.render('404');
    }
};

// Loga o usuário
exports.login = async (request, response) => {
    try {
        const login = new Login(request.body);
        await login.login();
    
        if(login.errors.length > 0) {
            request.flash('errors', login.errors);
            request.session.save(() => response.redirect('back'));
            return;
        };
    
        request.flash('success', 'Você entrou no sistema.');
        request.session.user = login.user;
        request.session.save(() => response.redirect('back'));
        return;
    } catch(e) {
        console.log(e);
        return response.render('404');
    }
};

// Desloga o danado
exports.logout = (request, response) => {
    request.session.destroy();
    return response.redirect('/');
};