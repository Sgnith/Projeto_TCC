// Carregando modulos
const express = require("express")
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const usuarios = require('./routes/usuario')
const empresas = require(path.join(__dirname, 'routes', 'empresa'))
const vagas = require('./routes/vagas')
const passport = require("passport")
require('./config/auth')(passport)
const truncateHtml = require('html-truncate');
const {nlogged} = require('./helpers/nlogged')
const multer = require('multer');
const fs = require('fs');


// imagem
{
const uploadDir = path.join(__dirname, 'public/uploads/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(bodyParser.json({ limit: '20mb' }));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});
app.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }
    const imageUrl = `/uploads/images/${req.file.filename}`; // Caminho para a imagem
    res.json({ url: imageUrl });
});
app.post('/delete-image', (req, res) => {
    const { imageUrl } = req.body;
    const imagePath = path.join(__dirname, 'public', imageUrl.split('/public/')[1]); // Ajuste o caminho conforme necessário

    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error('Erro ao excluir o arquivo:', err);
            return res.status(500).send('Erro ao excluir o arquivo');
        }
        res.send('Imagem excluída com sucesso');
    });
});
};
// Configs
    // Sessão
        app.use(session({
            secret: 'teste',
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    
    // Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null;
            next()
        })

    // Boby Parser
        app.use(bodyParser.urlencoded({extended:false}))
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
        app.use(bodyParser.json({ limit: '20mb' }));

    // Handlebars
        app.engine('handlebars', handlebars.engine({
        defaultLayout:'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true
        },
        helpers: {
            eq: function(a, b) {
              return a == b;
            },
            neq:  function(a, b) {
                return  a !== b;
            },
            lt: function(a, b) {
                return a < b;
            },
            gt: function(a, b) {
                return a > b;
            },
            or: function(a,b) {
                return a || b;
            },
            add:  function(a, b) {
                return a + b;
            },
            minus:  function(a, b) {
                return a - b;
            },
            limitaNome: function(nome) {
                if (nome.length > 11){
                    return nome.substring(0, 8) + '...';
                }else{
                    return nome;
                }
            },
            limitaDesc: function(desc) {
                return truncateHtml(desc, 120); 
            },
            limitaDesc2: function(desc) {
                return truncateHtml(desc, 500); 
            },
            tipoEq: function(tipo){
                if (tipo == 0){
                    return 2
                }else{
                    return 0
                }
            },
            formatarData: function(date) {
                const meses = [
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro'
                ];
                const day = date.getDate();
                const month = meses[date.getMonth()];
                const year = date.getFullYear();
                return `${day} de ${month} de ${year}`;
            },
            estrelaPerdidaEm: function(dataPerdida) {
                const meses = 6;
                dataPerdida.setMonth(dataPerdida.getMonth() + meses);
                return formatarData(dataPerdida);
            },
            exibirTipo: function(tipo) {
                const tipos = {
                    1: 'Estágio',
                    2: 'Auxiliar',
                    3: 'Assistente',
                    4: 'Júnior',
                    5: 'Pleno',
                    6: 'Sênior',
                    7: 'Coordenador',
                    8: 'Gerente',
                    9: 'Diretor'
                };
                return tipos[tipo] || 'Tipo Desconhecido';
            },
            exibirModalidade: function(modalidade) {
                const modalidades = {
                    1: 'Presencial',
                    2: 'Remoto',
                    3: 'Híbrido'
                };
                return modalidades[modalidade] || 'Modalidade Desconhecida';
            },
            exibirCargaHoraria: function(carga_horaria) {
                const cargas = {
                    1: 'Parcial (Manhã)',
                    2: 'Parcial (Tarde)',
                    3: 'Noturno',
                    4: 'Integral',
                    5: 'Flexível',
                };
                return cargas[carga_horaria] || 'Carga Horária Desconhecida';
            },
            exibirArea: function(area) {
                const areas = {
                    1: 'Administração',
                    2: 'Processos Gerenciais',
                    3: 'Gestão do Agronegócio',
                    4: 'Recursos Humanos',
                    5: 'Vendas',
                    6: 'Arquitetura e Urbanismo',
                    7: 'Engenharia Civi',
                    8: 'Engenharia Mecânica',
                    9: 'Engenharia Elétrica',
                    10: 'Engenharia Química',
                    11: 'Engenharia de Produção',
                    12: 'Engenharia de Computação',
                    13: 'Engenharia de Software',
                    14: 'Engenharia Ambiental e Sanitária',
                    15: "Engenharia de Alimentos",
                    16: 'Engenharia de Telecomunicações',
                    17: 'Engenharia Biomédica',
                    18: 'Tecnologia da Informação',
                    19: 'Design Gráfico',
                    20: 'Enfermagem',
                    21: 'Fisioterapia',
                    22: 'Psicologia',
                    23: 'Pedagogia',
                    24: 'Serviço Social',
                    25: 'Logística',
                    26: 'Jornalismo',
                    27: 'Turismo e Hospitalidade',
                    28: 'Marketing'
                };
                return areas[area] || 'Área Desconhecida';
            },
            exibirCurso: function(curso) {
                const cursos = {
                    1: "Administração",
                    2: "Processos Gerenciais",
                    3: "Gestão do Agronegócio",
                    4: "Recursos Humanos",
                    5: "Vendas",
                    6: "Arquitetura e Urbanismo",
                    7: "Engenharia Civil",
                    8: "Engenharia Mecânica",
                    9: "Engenharia Elétrica",
                    10: "Engenharia Química",
                    11: "Engenharia de Produção",
                    12: "Engenharia de Computação",
                    13: "Engenharia de Software",
                    14: "Engenharia Ambiental e Sanitária",
                    15: "Engenharia de Alimentos",
                    16: "Engenharia de Telecomunicações",
                    17: "Engenharia Biomédica",
                    18: "Tecnologia da Informação",
                    19: "Design Gráfico",
                    20: "Enfermagem",
                    21: "Fisioterapia",
                    22: "Psicologia",
                    23: "Pedagogia",
                    24: "Serviço Social",
                    25: "Logística",
                    26: "Jornalismo",
                    27: "Turismo e Hospitalidade",
                    28: "Marketing",
                }
                return cursos[curso] || 'Curso Desconhecido';
            }
          },
        }))
        app.set('view engine','handlebars')


    // Public
        app.use(express.static('public', {
            setHeaders: (res, path) => {
            if (path.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css');
            } else if (path.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
                res.setHeader('Content-Type', 'image/jpeg');
            }
            }
        }));

    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp').then(()=>{
            console.log('MongoDB conectado!')
        }).catch((erro)=>{
            console.log(erro)
        })

// Rotas
    // Principal
        app.get('/',(req,res)=>{
            if (req.isAuthenticated()){
                res.redirect('/home')
            } else {
                res.render('index')
            }
        })
        app.get('/home', nlogged, (req,res)=>{
            res.render('home')
        })
    // Admins
        app.use('/admin',admin)
    // Usuarios
        app.use('/usuarios', usuarios)
    // Empresas
        app.use('/empresas', empresas)
    // Vagas
        app.use('/vagas', vagas)

// Outros
    const port = process.env.PORT || 3000
    app.listen(port,()=>{
        console.log("Servidor rodando!")
    })