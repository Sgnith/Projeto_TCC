const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('Usuario')
require('../models/Vaga')
const Vaga = mongoose.model('Vaga')
require('../models/Candidatura')
const Candidatura = mongoose.model('Candidatura')
const {nlogged} = require('../helpers/nlogged')
const {logged} = require('../helpers/logged')


router.get('/', (req, res) => {
    const umMesAtras = new Date();
    umMesAtras.setMonth(umMesAtras.getMonth() - 1);

    const perPage = 10; // Quantas vagas mostrar por página
    const page = parseInt(req.query.page) || 1; // Página atual, padrão para a 1ª página se não for especificada

    Vaga.countDocuments().then((totalVagas) => { // Contagem total de vagas no banco
        const totalPages = Math.ceil(totalVagas / perPage); // Calcula o total de páginas

        Vaga.find()
            .populate({ path: 'usuario', select: 'empresa foto_perfil' })
            .lean()
            .skip((perPage * page) - perPage) // Pula as vagas já exibidas
            .limit(perPage) // Limita a quantidade de vagas retornadas por página
            .then((vagas) => {
                const vagasComEstrela = vagas.filter(vaga =>
                    vaga.usuario && 
                    Array.isArray(vaga.usuario.empresa) && 
                    vaga.usuario.empresa[0] && 
                    vaga.usuario.empresa[0].estrela && 
                    vaga.usuario.empresa[0].estrela >= umMesAtras
                ).map(vaga => {
                    vaga.temEstrela = true;
                    return vaga;
                });
            
                const vagasSemEstrela = vagas.filter(vaga =>
                    !vaga.usuario.empresa[0]?.estrela || vaga.usuario.empresa[0]?.estrela < umMesAtras
                ).map(vaga => {
                    vaga.temEstrela = false;
                    return vaga;
                });
            
                vagasComEstrela.sort((a, b) => new Date(b.usuario.empresa[0]?.estrela) - new Date(a.usuario.empresa[0]?.estrela));
                vagasSemEstrela.sort((a, b) => new Date(b.data) - new Date(a.data));
            
                const vagasOrdenadas = [...vagasComEstrela, ...vagasSemEstrela];
            
                res.render('vagas/vagas', {
                    vagas: vagasOrdenadas,
                    currentPage: page,
                    totalPages: totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                });
            })
            .catch(err => {
                console.error("Erro ao buscar e renderizar vagas:", err);
                res.status(500).send("Erro interno ao carregar as vagas");
            });
    });
});

router.post('/vaga_:titulo', async (req, res) => {
    try {
        const vaga = await Vaga.findOne({_id: req.body.id});
        if (!vaga) {
            req.flash('error_msg', 'Vaga não encontrada!');
            return res.redirect('/vagas');
        }

        const usuario = await Usuario.findById(vaga.usuario);
        let adm = false; 

        if (usuario && usuario.tipo === 1) {
            adm = true;
        }

        res.render('vagas/vaga', { vaga, usuario, adm });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Ocorreu um erro ao buscar a vaga!');
        res.redirect('/vagas');
    }
});

router.post('/vaga/candidatura',nlogged,(req,res)=>{
    Vaga.findOne({_id: req.body.id_vaga}).then((vaga)=>{
        Usuario.findOne({_id: req.body.id_user}).then((usuario)=>{
            Candidatura.findOne({vaga: vaga._id, candidato: usuario._id}).then((candidatura)=>{
                if (candidatura) {
                    req.flash('error_msg', 'Você já se candidatou a essa vaga!');
                    res.redirect('/vagas');
                } else {
                    vaga.candidaturas = vaga.candidaturas + 1;
                    vaga.save().then(() => {
                        const novaCandidatura = new Candidatura({
                            vaga: vaga._id,
                            candidato: usuario._id
                        });
                        novaCandidatura.save().then(() => {
                            req.flash('success_msg', 'Você se candidatou com sucesso!');
                            res.redirect('/vagas');
                        }).catch((err) => {
                            console.log(err);
                            req.flash('error_msg', 'Erro ao se candidatar!');
                            res.redirect('/vagas');
                        });
                    }).catch((err) => {
                        console.log(err);
                        req.flash('error_msg', 'Erro ao atualizar o número de candidaturas!');
                        res.redirect('/vagas');
                    });
                }
            }).catch((err) => {
                console.log(err);
                req.flash('error_msg', 'Erro ao verificar candidatura');
                res.redirect('/vagas');
            });
        }).catch((err) => {
            console.log(err);
            req.flash('error_msg', 'Erro ao encontrar usuário');
            res.redirect('/vagas');
        });
    }).catch((err) => {
        console.log(err);
        req.flash('error_msg', 'Erro ao encontrar vaga');
        res.redirect('/vagas');
    });
});


router.post('/filtrar', (req, res) => {
    const { modalidade, tipo, carga_horaria, area } = req.body;

    let filtro = {};

    if (modalidade) filtro.modalidade = Number(modalidade);
    if (tipo) filtro.tipo = Number(tipo);
    if (carga_horaria) filtro.carga_horaria = Number(carga_horaria);
    if (area) filtro.area = Number(area);
    fil=true

    Vaga.find(filtro).lean().then((vagas) => {
        res.render('vagas/vagas',{vagas,fil,filtro});
    }).catch((err) => {
        console.log(err);
        res.redirect('/vagas')
    });
});

router.get('/autocomplete', (req, res) => {
    const query = req.query.q;

    Vaga.find({ titulo: { $regex: query, $options: 'i' } }) 
        .limit(10)
        .then(vagas => {
            res.json(vagas);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Erro ao buscar vagas');
        });
});

router.get('/aplicacoes', nlogged, (req, res) => {
    const userId = req.user._id;

    Candidatura.find({ candidato: userId }).lean().then((candidaturas) => {
        const vagaIds = candidaturas.map(candidatura => candidatura.vaga);

        Vaga.find({ _id: { $in: vagaIds } }).populate('usuario', 'nome').lean().then((vagas) => {
            const vagasComCandidaturas = vagas.map(vaga => {
                const candidatura = candidaturas.find(c => String(c.vaga) === String(vaga._id));
                return { ...vaga, candidatura };
            });

            res.render('usuarios/aplicacoes', { vagas: vagasComCandidaturas });
        }).catch((err) => {
            console.error(err);
            res.status(500).send('Erro ao buscar vagas');
        });

    }).catch((err) => {
        console.error(err);
        res.status(500).send('Erro ao buscar candidaturas');
    });
});






module.exports = router