const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('Usuario')
const bcrypt = require('bcryptjs')
const passport = require("passport")
const {nlogged} = require('../helpers/nlogged')
const {logged} = require('../helpers/logged')
require('../models/Curriculo')
const  Curriculo = mongoose.model('Curriculo')
const multer = require('multer');
const path = require('path');
require('../models/Candidatura')
const Candidatura = mongoose.model('Candidatura')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configurar o transporte do Nodemailer
let transporter = nodemailer.createTransport({
    service: 'Gmail', // ou qualquer outro serviço de e-mail
    auth: {
        user: '4kaka5mon0@gmail.com', // seu e-mail
        pass: 'bvpd byoo bpxe bcsl' // sua senha do e-mail
    }
});

// Config Multer
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads/');
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${req.user._id}${ext}`);  // Usando o ID do usuário para nomear o arquivo
        }
    });
    const upload = multer({ storage });

// Rota para processar o upload da foto
    router.post('/uploadFoto', upload.single('foto'), (req, res) => {
        if (!req.file) {
            return res.status(400).send('Nenhuma imagem foi enviada.');
        }

        // Atualizando o campo foto_perfil do usuário no banco de dados
        Usuario.findByIdAndUpdate(req.user._id, { foto_perfil: req.file.filename })
            .then(() => {
                res.redirect('/');  // Redireciona para a página do perfil
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Erro ao atualizar foto de perfil.');
            });
    });

// Registro
    router.get('/registro', logged, (req, res) => {
        res.render('usuarios/registro');
    });

    router.post('/registro', async (req, res) => {
        var erros = [];
        if (!req.body.nome || typeof req.body.nome === undefined || req.body.nome == null) {
            erros.push({ texto: 'Nome é obrigatório' });
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
        const senha = req.body.senha;
        const sequenciaRegex = /(\d|[a-zA-Z])\1+/;
        if (sequenciaRegex.test(senha)) {
            erros.push({ texto: 'A senha não pode ser uma sequência de caracteres consecutivos' });
        }
        const iguaisRegex = /^(\w)\1*$/;
        if (iguaisRegex.test(senha)) {
            erros.push({ texto: 'A senha não pode ter todos os caracteres iguais' });
        }
    
        if (erros.length > 0) {
            res.render('usuarios/registro', { erros: erros });
        } else {
            try {
                const usuarioExistente = await Usuario.findOne({ email: req.body.email });
                if (usuarioExistente) {
                    req.flash('error_msg', 'Já existe uma conta com esse email');
                    return res.redirect('/usuarios/registro');
                } else {
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        sobrenome: req.body.sobrenome,
                        email: req.body.email,
                        senha: req.body.senha,
                        tipo: 0, // tipo 0 para usuário comum
                        ativo: false // Inicialmente, a conta não está ativada
                    });
    
                    // Hash da senha
                    const salt = await bcrypt.genSalt(10);
                    novoUsuario.senha = await bcrypt.hash(novoUsuario.senha, salt);
                    await novoUsuario.save();
    
                    // Gerar um token de verificação
                    const token = jwt.sign({ id: novoUsuario._id }, 'seusupersegredo', { expiresIn: '1d' });
    
                    // Criar o link de verificação
                    const linkDeVerificacao = `http://15.228.145.66:3000/usuarios/verify/${token}`;
    
                    // Enviar o e-mail
                    const mailOptions = {
                        from: '4kak5mon0@gmail.com',
                        to: novoUsuario.email,
                        subject: 'Verifique seu e-mail',
                        html: `<p>Por favor, clique no link para verificar sua conta:</p><a href="${linkDeVerificacao}">Verificar conta</a>`
                    };
    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            req.flash('error_msg', 'Erro ao enviar e-mail de verificação.');
                            return res.redirect('/usuarios/registro');
                        }
                        req.flash('success_msg', 'E-mail de verificação enviado! Verifique sua caixa de entrada.');
                        res.redirect('/usuarios/login');
                    });
                }
            } catch (erro) {
                console.log(erro);
                req.flash('error_msg', 'Erro ao salvar usuário');
                res.redirect('/usuarios/registro');
            }
        }
    });
    // Verificação de email
    router.get('/verify/:token', async (req, res) => {
        const { token } = req.params;
    
        try {
            const decoded = jwt.verify(token, 'seusupersegredo');
            const usuario = await Usuario.findById(decoded.id);
    
            if (usuario) {
                usuario.ativo = true; // Marcar como ativo
     await usuario.save();
                req.flash('success_msg', 'Conta ativada com sucesso! Você pode agora fazer login.');
                return res.redirect('/usuarios/login');
            } else {
                req.flash('error_msg', 'Usuário não encontrado.');
                return res.redirect('/usuarios/registro');
            }
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Token inválido ou expirado.');
            return res.redirect('/usuarios/registro');
        }
    });

// Login
router.get('/login', logged, (req, res) => {
    res.render('usuarios/login');
});

router.post('/login', async (req, res, next) => {
    const { email, senha } = req.body;

    try {
        // Verificar se o usuário existe e se a conta está ativa
        const usuario = await Usuario.findOne({ email });
        if (usuario) {
            if (!usuario.ativo) {
                req.flash('error_msg', 'Sua conta não está ativada. Verifique seu e-mail para ativá-la.');
                return res.redirect('/usuarios/login');
            }
        }

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/usuarios/login',
            failureFlash: true
        })(req, res, next);
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Ocorreu um erro ao tentar fazer login.');
        res.redirect('/usuarios/login');
    }
});

// Logout
    router.get('/logout', (req, res, next) => {
        req.logout(function(erro) {
            if (erro) { return next(erro) }
            res.redirect('/')
          })
    })

// Rota para solicitar redefinição de senha
    router.get('/esqueci-minha-senha', (req, res) => {
        res.render('usuarios/esqueci-minha-senha'); // Renderiza um formulário para o usuário inserir o e-mail
    });

    router.post('/esqueci-minha-senha', async (req, res) => {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            req.flash('error_msg', 'Nenhum usuário encontrado com esse e-mail.');
            return res.redirect('/usuarios/esqueci-minha-senha');
        }

        // Gerar um token de redefinição de senha
        const token = jwt.sign({ id: usuario._id }, 'seusupersegredo', { expiresIn: '1h' });

        // Criar o link de redefinição de senha
        const linkDeRedefinicao = `http://localhost:3000/usuarios/redefinir-senha/${token}`;

        // Enviar o e-mail
        const mailOptions = {
            from: '4kaka5mon0@gmail.com',
            to: usuario.email,
            subject: 'Redefinição de Senha',
            html: `<p>Por favor, clique no link para redefinir sua senha:</p><a href="${linkDeRedefinicao}">Redefinir Senha</a>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                req.flash('error_msg', 'Erro ao enviar e-mail de redefinição de senha.');
                return res.redirect('/usuarios/esqueci-minha-senha');
            }
            req.flash('success_msg', 'E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.');
            res.redirect('/usuarios/login');
        });
    });

// Rota para redefinir a senha
    router.get('/redefinir-senha/:token', (req, res) => {
        const { token } = req.params;

        // Verificar se o token é válido
        jwt.verify(token, 'seusupersegredo', (err, decoded) => {
            if (err) {
                req.flash('error_msg', 'Token inválido ou expirado.');
                return res.redirect('/usuarios/esqueci-minha-senha');
            }
            res.render('usuarios/redefinir-senha', { token }); // Renderiza um formulário para inserir a nova senha
        });
    });

    router.post('/redefinir-senha', async (req, res) => {
        const { senha, senha2, token } = req.body;
        console.log('Token recebido:', token);

        if (senha !== senha2) {
            req.flash('error_msg', 'As senhas não coincidem.');
            return res.redirect(`/redefinir-senha/${token}`);
        }

        try {
            const decoded = jwt.verify(token, 'seusupersegredo');
            const usuario = await Usuario.findById(decoded.id);

            if (!usuario) {
                req.flash('error_msg', 'Usuário não encontrado.');
                return res.redirect('/usuarios/esqueci-minha-senha');
            }

            // Hash da nova senha
            const salt = await bcrypt.genSalt(10);
            usuario.senha = await bcrypt.hash(senha, salt);
            await usuario.save();

            req.flash('success_msg', 'Senha redefinida com sucesso! Você pode agora fazer login.');
            res.redirect('/usuarios/login');
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Erro ao redefinir a senha.');
            res.redirect('/usuarios/esqueci-minha-senha');
        }
    });

// Curriculo
    router.get('/curriculo/:id', nlogged, (req, res) => {
        const usuarioId = req.params.id;
        Curriculo.findOne({ usuario: usuarioId }).then((curriculo) => {
        if (!curriculo) {
            // Crie um novo currículo para o usuário
            const novoCurriculo = new Curriculo({ usuario: usuarioId, idiomas:[{nome:"Português",nivel:'Nativo'}] });
            novoCurriculo.save().then(() => {
                res.render('usuarios/curriculo', {
                    curriculo: novoCurriculo,
                    positivo: false
                });
            });
        } else {
            res.render('usuarios/curriculo', {
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
    router.post('/curriculo/editar', nlogged,(req,res)=>{
        const formacoes = JSON.parse(req.body.formacoes) || [];
        const experiencias = JSON.parse(req.body.experiencias) || [];
        const idiomas = JSON.parse(req.body.idiomas) || [];
        const habilidades = JSON.parse(req.body.habilidades) || [];

        const usuarioId = req.body.usuario_id;
        
        Curriculo.findOne({ usuario: usuarioId }).then((curriculo) => {
            if (!curriculo) {
                const novoCurriculo = new Curriculo({ usuario: usuarioId });
                novoCurriculo.save().then(() => {
                    res.redirect('/curriculo/' + usuarioId);
                });
            } else {
                curriculo.resumo = req.body.resumo
                curriculo.ddd = req.body.ddd
                curriculo.num = req.body.num
                curriculo.whatsapp = req.body.whatsapp
                curriculo.idade = req.body.idade
                curriculo.estado_civil = req.body.estado_civil
                curriculo.sexo = req.body.sexo
                curriculo.deficiencia = (req.body.deficiencia == 'on')
                curriculo.deficiencia_txt = req.body.deficiencia_txt

                curriculo.formacoes = formacoes.map((formacao) => ({
                    instituicao: formacao.instituicao,
                    nivel: formacao.nivel,
                    curso: formacao.curso,
                    dataInicio: formacao.dataInicio,
                    status: formacao.status,
                    dataFim: formacao.status === '3' ? null : (formacao.dataFim ? formacao.dataFim : '')
                }));
                curriculo.experiencias = experiencias.map((experiencia) => ({
                    empresa: experiencia.empresa,
                    cargo: experiencia.cargo,
                    nivel: experiencia.nivel,
                    dataInicio: experiencia.dataInicio,
                    dataFim: experiencia.dataFim ? experiencia.dataFim : '',
                    descricao: experiencia.descricao
                }));
                curriculo.idiomas = idiomas.map((idioma) => ({
                    nome: idioma.nome,
                    nivel: idioma.nivel
                }));
                curriculo.habilidades = habilidades.map((habilidade) => ({
                    nome: habilidade.nome
                }));

                curriculo.moto = (req.body.moto === 'on');
                curriculo.carro = req.body.veiculo
                curriculo.viagem = req.body.viagem
                curriculo.mudanca = req.body.mudanca
                curriculo.jornada = req.body.jornada
                curriculo.tipo_contrato = req.body.tipo_contrato

                curriculo.usuario = usuarioId
                Usuario.findByIdAndUpdate(usuarioId, {
                    nome: req.body.nome,
                    sobrenome: req.body.sobrenome
                  }).catch((err) => {
                    console.error(err);
                  });

                  curriculo.save().then(() => {
                    req.flash('success_msg', 'Curriculo editado com sucesso');
                    res.redirect("/");  
                });
            }
        }).catch((err) => {
            console.error('Erro ao salvar currículo:', err);
            req.flash('error_msg', 'Erro ao salvar currículo');
            res.redirect("/");  
        });
    });
// Modificar dados de usuario
    router.get('/modificardados', nlogged, (req,res)=>{
        Usuario.findById(req.user._id).then((usuario)=>{
            const empresa = usuario.empresa && usuario.empresa.length > 0 ? usuario.empresa[0] : {};
            res.render('usuarios/modificardados',{usuario, empresa})
        }).catch((err)=>{
            console.error(err)
        })
    })
    router.post('/modificarados/save', nlogged, (req, res) => {
        const userId = req.body.user_id;
        const { nome, sobrenome, Curso, senha, senha2, Cnpj, Endereco, Telefone, Departamento, email } = req.body;
        var erros = [];
    
        // Verificações:
        if (!nome || typeof nome == undefined || nome == null) {
            erros.push({ texto: 'Nome é obrigatório' });
        }
        if (req.body.user_tipo === 2) { // Se for empresa
            if (!Cnpj || typeof Cnpj == undefined || Cnpj == null) {
                erros.push({ texto: 'CNPJ inválido' });
            }
            if (!Endereco || typeof Endereco == undefined || Endereco == null) {
                erros.push({ texto: 'Endereço inválido' });
            }
            if (!Telefone || typeof Telefone == undefined || Telefone == null || Telefone.length < 10) {
                erros.push({ texto: 'Telefone inválido' });
            }
            if (!Departamento || typeof Departamento == undefined || Departamento == null) {
                erros.push({ texto: 'Departamento inválido' });
            }
        } else { // Se for usuário comum
            if (!sobrenome || typeof sobrenome == undefined || sobrenome == null) {
                erros.push({ texto: 'Sobrenome é obrigatório' });
            }
            if (!Curso || typeof Curso == undefined || Curso == null) {
                erros.push({ texto: 'Curso é obrigatório' });
            }
        }
    
        if (senha && senha.length < 6) {
            erros.push({ texto: 'Senha muito curta' });
        }
        if (senha !== senha2) {
            erros.push({ texto: 'As senhas não coincidem' });
        }
    
        if (erros.length > 0) {
            res.render('/', { erros, usuario: req.user, empresa: req.body.user_empresa[0] || {} });
        } else {
            Usuario.findById(userId).then((usuario) => {
                // Atualizar dados básicos
                usuario.nome = nome;
                if (usuario.tipo !== 2) {
                    usuario.sobrenome = sobrenome;
                    usuario.curso = Curso;
                    usuario.email = email
                }
    
                // Atualizar empresa, se for tipo empresa
                if (usuario.tipo === 2) {
                    usuario.empresa[0].cnpj = Cnpj;
                    usuario.empresa[0].endereco = Endereco;
                    usuario.empresa[0].tel = Telefone;
                    usuario.empresa[0].departamento = Departamento;
                }
    
                // Atualizar senha se fornecida
                if (senha && senha === senha2) {
                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(senha, salt, (erro, hash) => {
                            if (erro) {
                                req.flash('error_msg', 'Erro ao salvar a nova senha');
                                return res.redirect('/');
                            }
                            usuario.senha = hash;

                            usuario.save().then(() => {
                                req.flash('success_msg', 'Dados atualizados com sucesso');
                                res.redirect('/');
                            }).catch((err) => {
                                console.error('Erro ao salvar os dados:', err);
                                req.flash('error_msg', 'Erro ao salvar os dados');
                                res.redirect('/');
                            });
                        });
                    });
                } else {
                    usuario.save().then(() => {
                        req.flash('success_msg', 'Dados atualizados com sucesso');
                        res.redirect('/');
                    }).catch((err) => {
                        console.error('Erro ao salvar os dados:', err);
                        req.flash('error_msg', 'Erro ao salvar os dados');
                        res.redirect('/');
                    });
                }
            }).catch((err) => {
                console.error('Erro ao buscar usuário:', err);
                req.flash('error_msg', 'Erro ao buscar o usuário');
                res.redirect('/');
            });
        }
    });
    router.post('/aplicacoes/excluir', nlogged, (req,res)=>{
        const idvaga = req.body.id
        const iduser = req.user._id

        Candidatura.deleteOne({vaga: idvaga, candidato: iduser}).then(()=>{
            req.flash('success_msg', 'Aplicação removida com sucesso!')
            res.redirect('/vagas/aplicacoes')
        }).catch((err)=>{
            console.error('Erro ao remover aplicação:', err);
            req.flash('error_msg', 'Erro ao remover a aplicação');
            res.redirect('/vagas/aplicacoes');
        })
    })
        
    router.get('/vizualizar', nlogged, async (req, res) => {
        try {
            const perPage = 8;
            const page = parseInt(req.query.page) || 1; 
            const searchTerm = req.query.search || '';
            const userTipo = req.user.tipo;
    
            let tipoFilter = {};
            
            if (userTipo === 2) {
                tipoFilter.tipo = 0;
            } else if (userTipo === 0) {
                tipoFilter.tipo = 2;
            }

            const totalUsuarios = await Usuario.countDocuments({
                ...tipoFilter,
                nome: { $regex: searchTerm, $options: 'i' }
            });
    
            const totalPages = Math.ceil(totalUsuarios / perPage);
    
            const usuarios = await Usuario.find({
                ...tipoFilter,
                nome: { $regex: searchTerm, $options: 'i' }
            })
            .lean()
            .skip((perPage * page) - perPage)
            .limit(perPage);

            res.render('usuarios/lista', {
                usuarios: usuarios,
                currentPage: page,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                nextPage: `/usuarios/vizualizar?page=${page + 1}&search=${searchTerm}`,
                previousPage: `/usuarios/vizualizar?page=${page - 1}&search=${searchTerm}`,
                showing: {
                    from: ((page - 1) * perPage) + 1,
                    to: Math.min(page * perPage, totalUsuarios),
                    total: totalUsuarios
                }
            });
    
        } catch (err) {
            console.error('Erro:', err);
            req.flash('error_msg', 'Erro ao carregar lista de usuários');
            res.redirect('/');
        }
    });
    
    router.get('/autocomplete', nlogged, async (req, res) => {
        try {
            const searchTerm = req.query.q || '';
            const usuarios = await Usuario.find({
                nome: { $regex: searchTerm, $options: 'i' }
            }).limit(5).lean(); 
    
            const suggestions = usuarios.map(user => {
                return {
                    nomeCompleto: user.sobrenome ? `${user.nome} ${user.sobrenome}` : user.nome,
                    id: user._id 
                };
            });
    
            res.json(suggestions); 
        } catch (err) {
            console.error('Erro:', err);
            res.status(500).send('Erro ao buscar sugestões');
        }
    });

    router.post('/visualizar/curriculo', nlogged, async (req, res) => {
        try {
            const usuario = await Usuario.findById(req.body.id_user);
            if (!usuario) {
                req.flash('error_msg', 'Usuário não encontrado');
                return res.redirect('/');
            }
    
            const curriculo = await Curriculo.findOne({ usuario: usuario._id });
            if (!curriculo) {
                req.flash('error_msg', 'Currículo não encontrado');
                return res.redirect('/');
            }
    
            res.render('usuarios/curriculo_emp', {
                usuario: usuario,
                curriculo: curriculo,
                formacoes: JSON.stringify(curriculo.formacoes || []),
                experiencias: JSON.stringify(curriculo.experiencias || []),
                idiomas: JSON.stringify(curriculo.idiomas || []),
                habilidades: JSON.stringify(curriculo.habilidades || []),
                positivo: true,
                view: true
            });
        } catch (err) {
            console.error('Erro:', err);
            req.flash('error_msg', 'Erro ao carregar currículo');
            res.redirect('/');
        }
    });


module.exports = router
