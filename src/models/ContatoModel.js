const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
  responsavel: { type: String },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}
// Segue as info de cada método para quem estiver lendo possa entender o que eu fiz
// Método que cria o usuário no MDB
Contato.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;

  this.contato = await ContatoModel.create(this.body);
};

// Método que faz a válidação dos campos
Contato.prototype.valida = function() {
  this.cleanUp();

  if(!this.body.responsavel) {
    this.errors.push('Responsável inválido.');
  }

  if(this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push('E-mail inválido!');
  }

  if(!this.body.nome) {
    this.errors.push('Nome é um campo obrigatório.');
  }

  if(!this.body.email && !this.body.telefone) {
    this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
  }
};

// Método que checa strings nos campos informados nos dados do formulário.
Contato.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    };
  };

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
    responsavel: this.body.responsavel,
  };
};

// Método que edita os contatos
Contato.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos (Que não estão atrelados ao prototype, não tem acesso ao this)
Contato.buscaPorId = async function(id) {
  if(typeof id !== 'string') return; 
  const contato = await ContatoModel.findById(id);
  return contato;
};

// Lista contatos cadastrados lá no MDB e joga na agenda ("index")
// Só aparece se o usuário estiver logado e tiver cadastrado algum usuário.
Contato.buscaContatos = async function() {
  const contatos = await ContatoModel.find()
    .sort({ criadoEm: -1 });
    return contatos;
};

// Obviamente deleta um contato através do id cadstrado no MDB
Contato.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id });
  return contato;
};

module.exports = Contato;