const Contato = require('../models/ContatoModel');

exports.index = (request, response) => {
    response.render('contato', {
        contato: {},
    });
};

// Registra usuário
exports.register = async (request, response) => {
    try {
        const contato = new Contato(request.body);
        await contato.register();
    
        if(contato.errors.length > 0) {
            request.flash('errors', contato.errors);
            request.session.save(() => response.redirect('back'));
            return;
        };
    
        request.flash('success', 'Contato registrado com sucesso :)');
        request.session.save(() => response.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch(e) {
        console.log(e);
        return response.render('404');
    } 
};

// Aqui é o seguinte, após cadastrar um contato na agenda os dados do ctt permanecem nos input para edição.
exports.editIndex = async (request, response) => {
    if(!request.params.id) return response.render('404');
    const contato = await Contato.buscaPorId(request.params.id);
    if(!contato) return response.render('404');

    response.render('contato', { contato });
};

// Agora sim edita o contato
exports.edit = async (request, response) => {
    try {
        if(!request.params.id) return response.render('404');
        const contato = new Contato(request.body);
        await contato.edit(request.params.id);
    
        if(contato.errors.length > 0) {
            request.flash('errors', contato.errors);
            request.session.save(() => response.redirect('back'));
            return;
        };

        request.flash('success', 'Contato editado com sucesso.');
        request.session.save(() => response.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch(e) {
        console.log(e);
        return response.render('404');
    }
};

// Deleta o contato e manda pro espaço HAHAHA
exports.delete = async (request, response) => {
    if(!request.params.id) return response.render('404');
    const contato = await Contato.delete(request.params.id);
    if(!contato) return response.render('404');

    request.flash('success', 'Contato removido com sucesso.');
    request.session.save(() =>  response.redirect('back'));
    return;
};

//Obrigado por ter lido o meu código já é uma honra sério :)