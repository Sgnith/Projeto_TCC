const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Empresa = new Schema({
    cnpj: {
        type: Number,
        index: true
    },
    departamento:{
        type: String
    },
    estrela:{
        type: Date
    },
    endereco: {
        type: String
    },
    tel: {
        type: Number
    },
    site:{
        type: String
    },
    missao:{
        type: String
    },
    descricao:{
        type: String
    },
    num_func:{
        type: Number
    },
    sustentaveis:{
        type: String
    },
    email_contato:{
        type: String
    },
    dados_at:{
        type: Boolean,
        default: false
    },
})

const Usuario = new Schema({
    nome: {
        type: String
    },
    sobrenome:{
        type: String
    },
    email: {
        type: String,
        required: true
    },
    tipo:{
        type:Number,
        default:0       // 0= padrão; 1= admin; 2= empresa
    },
    senha:{
        type: String,
        required: true
    },
    ativo: {
        type: Boolean,
        default: false
    },
    curriculo: {
        type: Schema.Types.ObjectId,
        ref: 'Curriculo'
    },
    foto_perfil: {
        type: String
    },
    curso:{
        type: Number
    },
    empresa: [Empresa]
})

mongoose.model('Usuario',Usuario)