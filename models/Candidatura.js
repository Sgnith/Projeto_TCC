const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CandidaturaSchema = new Schema({
    vaga: {
        type: Schema.Types.ObjectId,
        ref: 'Vaga',
        required: true
    },
    candidato:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    selecionado:{
        type:Boolean,
        default:false
    },
    feedbackEnviado: {
        type: Boolean,
        default: false
    }
})

mongoose.model('Candidatura',CandidaturaSchema)