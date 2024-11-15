const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('Usuario')
require('../models/Vaga')
const Vaga = mongoose.model('Vaga')
require('../models/Candidatura')
const Candidatura = mongoose.model('Candidatura')
require('../models/Curriculo')
const Curriculo = mongoose.model('Curriculo')
const bcrypt = require('bcryptjs')
const passport = require("passport")
const {eEmpresa} = require('../helpers/eempresa')
const {nlogged} = require('../helpers/nlogged')
const {logged} = require('../helpers/logged')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Configurar o transporte do Nodemailer
let transporter = nodemailer.createTransport({
    service: 'Gmail', // ou qualquer outro serviço de e-mail
    auth: {
        user: '4kaka5mon0@gmail.com', // seu e-mail
        pass: 'bvpd byoo bpxe bcsl' // sua senha do e-mail
    }
});

// Registro
    router.get('/registro',logged,(req,res)=>{
        res.render('empresas/registro')
    })
    router.post('/registro', async (req, res) => {
        var erros = [];
    
        // Verificações
        if (!req.body.nome || typeof req.body.nome === undefined || req.body.nome == null) {
            erros.push({ texto: 'Nome é obrigatório' });
        }
        if (!req.body.Cnpj || typeof req.body.Cnpj === undefined || req.body.Cnpj == null || !validarCNPJ(req.body.Cnpj)) {
            erros.push({ texto: 'CNPJ inválido' });
        }
        if (!req.body.email || typeof req.body.email === undefined || req.body.email == null) {
            erros.push({ texto: 'Email inválido' });
        }
        if (!req.body.senha || typeof req.body.senha === undefined || req.body.senha == null) {
            erros.push({ texto: 'Senha inválida' });
        }
        if (req.body.senha.length < 6) {
            erros.push({ texto: 'Senha muito curta' });
        }
        if (req.body.senha != req.body.senha2) {
            erros.push({ texto: 'As senhas são diferentes' });
        }
    
        if (erros.length > 0) {
            return res.render('empresas/registro', { erros: erros });
        }
    
        try {
            const usuarioExistente = await Usuario.findOne({ 
                $or: [
                    { email: req.body.email }, 
                    { empresa: { $elemMatch: { cnpj: req.body.Cnpj } } }
                ] 
            });
    
            if (usuarioExistente) {
                const message = usuarioExistente.email === req.body.email ? 'Já existe uma conta com esse email' : 'Já existe uma empresa com esse CNPJ';
                req.flash('error_msg', message);
                return res.redirect('/empresas/registro');
            }
    
            const novoUsuario = new Usuario({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha,
                tipo: 2, // tipo 2 para empresas
                empresa: [
                    {
                        cnpj: req.body.Cnpj,
                        endereco: req.body.Endereco,
                        tel: req.body.Telefone,
                        departamento: req.body.Departamento
                    }
                ],
                ativo: false 
            });
    
            // Hash da senha
            const salt = await bcrypt.genSalt(10);
            novoUsuario.senha = await bcrypt.hash(novoUsuario.senha, salt);
            await novoUsuario.save();
    
            const token = jwt.sign({ id: novoUsuario._id }, 'seusupersegredo', { expiresIn: '1d' });
            const linkDeVerificacao = `http://localhost:3000/usuarios/verify/${token}`;
    
            const mailOptions = {
                from: '4kaka5mon0@gmail.com',
                to: novoUsuario.email,
                subject: 'Verifique seu e-mail',
                html: `<p>Por favor, clique no link para verificar sua conta:</p><a href="${linkDeVerificacao}">Verificar conta</a>`
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    req.flash('error_msg', 'Erro ao enviar e-mail de verificação.');
                    return res.redirect('/empresas/registro');
                }
                req.flash('success_msg', 'E-mail de verificação enviado! Verifique sua caixa de entrada.');
                res.redirect('/usuarios/login');
            });
        } catch (erro) {
            console.log(erro);
            req.flash('error_msg', 'Erro ao salvar usuário');
            res.redirect('/empresas/registro');
        }
    });
    // Função para validar o CNPJ
        function validarCNPJ(cnpj) {
            // Remover caracteres não numéricos
            cnpj = cnpj.replace(/[^\d]+/g, '');

            // CNPJ deve ter 14 dígitos
            if (cnpj.length !== 14) return false;

            // Validação do CNPJ (algoritmo simplificado)
            let soma = 0;
            let peso = 5;

            for (let i = 0; i < 12; i++) {
                soma += cnpj[i] * peso;
                peso = peso === 2 ? 9 : peso - 1;
            }

            let resto = (soma % 11);
            let digito1 = resto < 2 ? 0 : 11 - resto;

            soma = 0;
            peso = 6;

            for (let i = 0; i < 13; i++) {
                soma += cnpj[i] * peso;
                peso = peso === 2 ? 9 : peso - 1;
            }

            resto = (soma % 11);
            let digito2 = resto < 2 ? 0 : 11 - resto;

            return cnpj[12] == digito1 && cnpj[13] == digito2;
        }

router.get('/vagas', eEmpresa,(req,res)=>{
    Vaga.find({usuario: req.user.id}).then((vagas)=>{
        res.render('vagas/vagas_emp', {vagas:vagas})
    }).catch((err)=>{
        console.log(err)
    })
})

router.get('/vagas/criarvaga', eEmpresa,(req,res)=>{
    res.render('vagas/criarvaga')
})

router.post('/vagas/criarvaga/nova', eEmpresa, (req, res) => {
    // Validação de dados:
    var erros = []
    {
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto:'Titulo Invalido'})
    }
    }
    
    if(!(req.body.empresa == '' || typeof req.body.empresa == undefined || req.body.empresa == null)){
        var nomeempresa= req.body.empresa
    }else{
        var nomeempresa= req.user.nome
    }
    const novaVaga = new Vaga({
        titulo: req.body.titulo,
        empresa: nomeempresa,
        descricao: req.body.descricao,
        localizacao: req.body.localizacao,
        modalidade: req.body.modalidade,
        tipo: req.body.tipo,
        carga_horaria: req.body.carga_horaria,
        area: req.body.area,
        usuario: req.user._id,
        email: req.body.email,
        telefone: req.body.telefone
    })

    novaVaga.save().then(() => {
        req.flash('success_msg', 'Vaga criada com sucesso!');
        res.redirect('/empresas/vagas');
    }).catch((err) => {
        console.error(err);
        req.flash('error_msg', 'Erro ao criar vaga');
        res.redirect('/empresas/criarvaga');
    });
});

router.get('/vagas/editar/:id', eEmpresa,(req,res)=>{
    Vaga.findById(req.params.id).then((vaga)=>{
        res.render('vagas/editarvaga', {vaga:vaga})
    }).catch((err)=>{
        console.log(err)
        req.flash('error_msg','Essa Vaga não existe')
        res.redirect('/empresas/vagas')
    })
})
router.post('/vagas/editar', eEmpresa, (req,res)=>{
    Vaga.findOne({_id: req.body.id}).then((vaga)=>{
        if (!vaga) {
            req.flash('error_msg', 'Vaga não encontrada');
            res.redirect('/empresas/vagas');
            return;
        }
        vaga.titulo = req.body.titulo
        vaga.empresa = req.body.empresa || req.user.nome
        vaga.descricao = req.body.descricao
        vaga.localizacao = req.body.localizacao
        vaga.modalidade = req.body.modalidade
        vaga.tipo = req.body.tipo
        vaga.carga_horaria = req.body.carga_horaria
        vaga.area = req.body.area
        vaga.save().then(()=>{
            req.flash('success_msg', 'Vaga editada com sucesso!')
            res.redirect('/empresas/vagas')
        }).catch((err)=>{
            console.error(err)
            req.flash('error_msg', 'Erro ao editar vaga')
            res.redirect('/empresas/vagas')
        })
    })
})

router.post('/vagas/excluir', eEmpresa, (req, res) => {
    Vaga.findById(req.body.id).then((vaga) => {
        if (!vaga) {
            req.flash('error_msg', 'Vaga não encontrada!');
            return res.redirect('/empresas/vagas');
        }

        Candidatura.deleteMany({ vaga: vaga._id }).then(() => {
            Vaga.deleteOne({ _id: vaga._id }).then(() => {
                req.flash('success_msg', 'Vaga e candidaturas excluídas com sucesso!');
                res.redirect('/empresas/vagas');
            }).catch((err) => {
                console.error(err);
                req.flash('error_msg', 'Erro ao excluir vaga');
                res.redirect('/empresas/vagas');
            });
        }).catch((err) => {
            console.error(err);
            req.flash('error_msg', 'Erro ao excluir candidaturas');
            res.redirect('/empresas/vagas');
        });
    }).catch((err) => {
        console.error(err);
        req.flash('error_msg', 'Erro ao buscar vaga');
        res.redirect('/empresas/vagas');
    });
});

router.post('/vagas/:titulo/candidaturas', eEmpresa, async (req, res) => {
    try {
        const vaga = await Vaga.findById(req.body.id);
        if (!vaga) {
            req.flash('error_msg', 'Vaga não encontrada');
            return res.redirect('/empresas/vagas');
        }

        const candidaturas = await Candidatura.find({ vaga: vaga._id })
        .populate({
            path: 'candidato',
            populate: {
            path: 'curriculo'
            }
        })
        .lean();

        const candidatosComCurriculo = await Promise.all(candidaturas.map(async (candidatura) => {
        return {
            candidatura,
            usuario: candidatura.candidato,
            curriculo: await Curriculo.findOne({ usuario: candidatura.candidato._id }),
            vaga: vaga
        };
        }));

        res.render('vagas/candidaturas', { vaga, candidatos: candidatosComCurriculo });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Erro ao buscar candidaturas');
        res.redirect('/empresas/vagas');
    }
});

router.post('/vagas/:titulo/selecionados', eEmpresa, async (req, res) => {
    try {
        const vaga = await Vaga.findById(req.body.id);
        if (!vaga) {
            req.flash('error_msg', 'Vaga não encontrada');
            return res.redirect('/empresas/vagas');
        }

        const candidaturas = await Candidatura.find({ vaga: vaga._id }).populate('candidato');

        const candidatosComCurriculo = await Promise.all(candidaturas.map(async (candidatura) => {
            const usuario = candidatura.candidato;
            const curriculo = await Curriculo.findOne({ usuario: usuario._id });
            return {
                candidatura,
                usuario,
                curriculo,
                vaga: vaga
            };
        }));
        res.render('vagas/selecionados', { vaga, candidatos: candidatosComCurriculo });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Erro ao buscar selecionados');
        res.redirect('/empresas/vagas');
    }
});


router.post('/vagas/:titulo/:nome', eEmpresa, (req,res)=>{
    Vaga.findById(req.body.id_vaga).then((vaga)=>{
        Usuario.findById(req.body.id_user).then((usuario)=>{
            Curriculo.findOne({usuario: usuario._id}).then((curriculo)=>{
                res.render('usuarios/curriculo_emp',{
                    vaga: vaga,
                    usuario: usuario,
                    curriculo,
                    formacoes: JSON.stringify(curriculo.formacoes),
                    experiencias: JSON.stringify(curriculo.experiencias),
                    idiomas: JSON.stringify(curriculo.idiomas),
                    habilidades: JSON.stringify(curriculo.habilidades),
                    positivo: true,
                    view: false
            })
            }).catch((err)=>{
                console.log(err)
                req.flash('error_msg', 'Erro ao buscar curriculo')
                res.redirect('/empresas/vagas')
            })
        }).catch((err)=>{
            console.log(err)
            req.flash('error_msg', 'Erro ao buscar usuario')
            res.redirect('/empresas/vagas')
        })
    }).catch((err)=>{
        console.log(err)
        req.flash('error_msg', 'Erro ao buscar vaga')
        res.redirect('/empresas/vagas')
    })
})

router.post('/vagas/:titulo/:nome/contato', eEmpresa, async (req, res) => {
    try {
        const vaga = await Vaga.findById(req.body.id_vaga);
        const usuario = await Usuario.findById(req.body.id_user);
        
        if (!vaga || !usuario) {
            req.flash('error_msg', 'Vaga ou usuário não encontrados.');
            return res.redirect('/empresas/vagas');
        }

        const candidatura = await Candidatura.findOne({
            vaga: vaga._id,
            candidato: usuario._id
        });

        if (!candidatura) {
            req.flash('error_msg', 'Candidatura não encontrada.');
            return res.redirect('/empresas/vagas');
        }

        candidatura.selecionado = true;
        await candidatura.save();

        req.flash('success_msg', `Candidato selecionado`);
        Curriculo.findOne({usuario: usuario._id}).then((curriculo)=>{
            res.render('vagas/contato',{
                vaga: vaga,
                usuario: usuario,
                curriculo
            })
        })
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Erro ao selecionar candidato.');
        res.redirect('/empresas/vagas');
    }
});



router.post('/vagas/:titulo/:nome/feedback', eEmpresa, (req,res)=>{
    Vaga.findById(req.body.id_vaga).then((vaga)=>{
        Usuario.findById(req.body.id_user).then((usuario)=>{
            res.render('vagas/feedback', {vaga: vaga, usuario: usuario})
            //CONTINUE!!!
        })
    })
})

router.post('/vagas/:titulo/:nome/enviarfeedback', eEmpresa, (req, res) => {
    Usuario.findById(req.body.id_emp).then((empresa)=>{
        empresa.empresa[0].estrela = new Date()
        empresa.save()
    })
    Vaga.findById(req.body.id_vaga).then((vaga) => {
        Usuario.findById(req.body.id_user).then((usuario) => {
            Candidatura.findOneAndUpdate({ vaga: vaga._id, candidato: usuario._id }, {
                feedbackEnviado: true 
            }).then(() => {
                // Capturar os dados do formulário
                const { faltou, melhor, comparacao, melhoria, bom } = req.body;

                // Formatar o conteúdo do e-mail
                const emailContent = `
                    <h2>Feedback da Vaga: ${vaga.titulo}</h2>
                    <p><strong>O que faltou para o candidato ser selecionado:</strong> ${faltou ? faltou : 'N/A'}</p>
                    <p><strong>Melhorias no currículo ou entrevista:</strong> ${melhor ? melhor : 'N/A'}</p>
                    <p><strong>Comparação com outros candidatos:</strong> ${comparacao ? comparacao : 'N/A'}</p>
                    <p><strong>Áreas de desenvolvimento recomendadas:</strong> ${melhoria ? melhoria : 'N/A'}</p>
                    <p><strong>Ponto positivo da candidatura:</strong> ${bom ? bom : 'N/A'}</p>
                `;

                // Definir os detalhes do e-mail
                let mailOptions = {
                    from: 'nomefab@hotmail.com',
                    to: usuario.email, // e-mail do candidato
                    subject: `Feedback da Vaga: ${vaga.titulo}`,
                    html: emailContent // corpo do e-mail formatado
                };

                // Enviar o e-mail
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        req.flash('error_msg', 'Erro ao enviar feedback.');
                        return res.redirect(`/empresas/vagas/${vaga.titulo}`);
                    }
                    req.flash('success_msg', 'Feedback enviado com sucesso!');
                    res.redirect(`/empresas/vagas`);
                });
            });
        });
    });
});

router.get('/info/edit', nlogged, (req,res)=>{
    res.render('empresas/edit_info')
})
router.post('/info/save', nlogged, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.body.user_id);
        if (!usuario) {
            req.flash('error_msg', 'Usuário não encontrado');
            return res.redirect('/');
        }

        usuario.empresa[0].email_contato = req.body.email;
        usuario.empresa[0].endereco = req.body.endereco;
        usuario.empresa[0].tel = req.body.tel;
        usuario.empresa[0].site = req.body.site;
        usuario.empresa[0].departamento = req.body.Departamento;
        usuario.empresa[0].num_func = req.body.num_func;
        usuario.empresa[0].descricao = req.body.descricao;
        usuario.empresa[0].missao = req.body.missao;
        usuario.empresa[0].sustentaveis = req.body.sustentavel;
        usuario.empresa[0].dados_at = true;

        await usuario.save();
        
        req.flash('success_msg', 'Dados atualizados com sucesso!');
        res.redirect('/');
    } catch (err) {
        console.error('Erro ao salvar:', err);
        req.flash('error_msg', 'Erro ao atualizar dados');
        res.redirect('/');
    }
});
router.post('/info', nlogged, (req,res)=>{
    Usuario.findById(req.body.emp_id).then((usuario)=>{
        res.render('empresas/info', {usuario: usuario})
    }).catch((err)=>{
        console.log(err);
        req.flash('error_msg', 'Erro ao buscar empresa');
        res.redirect('/usuarios/visualizar');
    })    
})


module.exports = router;
