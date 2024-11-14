const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VagaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    empresa: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    localizacao: {
        type: String,
        required: true
    },
    modalidade: {           //presencial,remoto, etc
        type: Number,
        required: true
    },
    tipo: {                 //estagio, assistente, etc
        type: Number,
        required: true
    },
    carga_horaria: {
        type: Number,
        required: true
    },
    area: {                 // adm, eng, enf, etc
        type: Number,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    },
    candidaturas: {
        type: Number,
        default: 0
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    email: {
        type: String,
    },
    telefone: {
        type: Number,
    },
})

module.exports = mongoose.model('Vaga', VagaSchema);