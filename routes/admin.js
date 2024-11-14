const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('Usuario')
require('../models/Curriculo')
const  Curriculo = mongoose.model('Curriculo')
const {eAdmin} = require('../helpers/eadmin')


router.post('/usuario', eAdmin, (req, res) => {
    Usuario.findById(req.body.id_user).then((usuario)=>{
        res.render('admin/edit',{usuario})
    }).catch((err)=>{
        console.log(err)
        req.flash('error_msg','Erro ao ver usuario')
        res.redirect('/')
    })
})
router.post('/usuario/save', eAdmin, (req,res)=>{
    Usuario.findById(req.body.user_id).then((usuario)=>{
        usuario.nome = req.body.nome
        usuario.sobrenome = req.body.sobrenome
        usuario.curso = req.body.curso
        usuario.tipo = req.body.tipo
        usuario.save().then((usuario)=>{
            req.flash('success_msg','Usuario editado com sucesso')
            res.redirect('/')
        }).catch((err)=>{
            console.log(err)
            req.flash('error_msg','Erro ao editar usuario')
            res.redirect('/')
        })
    })
})

router.post('/usuario/modificadados', eAdmin, (req, res) => {
    Usuario.findById(req.body.user_id).then((usuario) => {
        const empresa = usuario.empresa && usuario.empresa.length > 0 ? usuario.empresa[0] : {};
        res.render('admin/modificauser', { usuario });
    }).catch((err)=>{
        console.error(err)
    })
});

router.post('/usuario/curriculo', eAdmin, (req, res) => {
    const usuarioId = req.body.user_id;
    Usuario.findById(usuarioId).then((usuario)=>{
        Curriculo.findOne({ usuario: usuarioId }).then((curriculo) => {
        if (!curriculo) {
            const novoCurriculo = new Curriculo({ usuario: usuarioId, idiomas:[{nome:"Português",nivel:'Nativo'}] });
            novoCurriculo.save().then(() => {
                res.render('admin/currriculo', {
                    usuario,
                    curriculo: novoCurriculo,
                    positivo: false
                });
            });
        } else {
            res.render('admin/currriculo', {
                usuario,
                curriculo,
                formacoes: JSON.stringify(curriculo.formacoes),
                experiencias: JSON.stringify(curriculo.experiencias),
                idiomas: JSON.stringify(curriculo.idiomas),
                habilidades: JSON.stringify(curriculo.habilidades),
                positivo: true
            });
        }
        });
    });
});

router.post('/empresa/editinfo', eAdmin, (req, res) => {
    Usuario.findById(req.body.user_id).then((usuario) => {
        res.render('admin/editinfo', {usuario});
    })
});



    
module.exports = router