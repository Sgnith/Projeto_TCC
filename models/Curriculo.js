const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema

// Formação
const Formacao = new Schema({
    instituicao: {
        type: String
    },
    nivel: {
        type: String
    },
    curso: {
        type: String
    },
    dataInicio: {
        type: Date
    },
    status:{
        type: Number
    },
    dataFim: {
        type: Date
    }
})


// Experiências
const Experiencia = new Schema({
    empresa: {
        type: String
    },
    cargo: {
        type: String
    },
    nivel:{
        type: String
    },
    dataInicio: {
        type: Date
    },
    dataFim: {
        type: Date
    },
    descricao: {
        type: String
    }
});

// Idiomas
const Idioma = new Schema({
    nome: {
        type: String
    },
    nivel:{
        type: String
    }
})

// Habilidades
const Habilidades = new Schema({
    nome: {
        type: String
    }
});

// Currículo
const Curriculo = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
      },
    resumo: {
        type: String,
        default:'',
        required: false
    },
    ddd: {
        type: Number,
        default:'',
        required: false
    },
    num: {
        type: Number,
        default:'',
        required: false
    },
    whatsapp: {
        type: Boolean,
        default: false
    },
    idade: {
        type: Number,
        required: false
    },
    estado_civil: {
        type: Number,
        default:'',
        required: false
    },
    sexo: {
        type: Number,
        default:'',
        required: false
    },
    deficiencia: {
        type: Boolean,
        default: false
    },
    deficiencia_txt:{
        type: String,
        required: false,
        default:''
    },
    formacoes:[Formacao],
    experiencias: [Experiencia],
    idiomas: [Idioma],
    habilidades: [Habilidades],
    moto:{
        type: Boolean,
        default: false
    },
    carro:{
        type: Number,
        default:''
    },
    viagem:{
        type: Boolean,
        default: false
    },
    mudanca:{
        type: Boolean,
        default: false
    },
    jornada:{
        type: Number,
        default:'',
        required: false
    },
    tipo_contrato:{
        type: Number,
        default:'',
        required: false
    }
});


mongoose.model('Curriculo',Curriculo)