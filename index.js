import express from 'express'

import session from 'express-session'

import cookieParser from 'cookie-parser'

const app = express()

app.use(session({
    secret: 'Minh4ChaviSi2',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpnOnly: true,
        maxAge: 1000 * 60 * 30
    }
}))

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));

app.use(express.static('./pages/public'))

const porta = 3000
const host = '0.0.0.0'

var listaUsuarios = [];

let mensagens = []

function Menu(req, resp) {
    let UltimoLogin = req.cookies['UltimoLogin']
    if (!UltimoLogin) {
        UltimoLogin = ''
    }
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Usuarios</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <style>
                .nav-link:hover {
                    text-decoration: underline;     
                }
            </style>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">MENU</a>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                                <a class="nav-link active" aria-current="page" href="/cadastraUsuario">Cadastrar Usuario</a>
                                <a class="nav-link active" aria-current="page" href="/batePapo">Bate-papo</a>
                                <a class="nav-link active" aria-current="page" href="/logout">Sair</a>
                                <a class="nav-link disabled" aria-disabled="true">Ultimo acesso: ${UltimoLogin}</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
        `);
}
function autenticarLogin(req, resp) {
    const usuario = req.body.usuario
    const senha = req.body.senha

    if (usuario === 'admin' && senha === '123') {
        req.session.usuarioLogado = true
        resp.cookie('UltimoLogin', new Date().toLocaleString('pt-BR'), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true })
        resp.redirect('/')
    }
    else {
        resp.send(`
            <html>
                 <head>
                    <meta charset="utf-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                </head>
                <body>
                        <div class="container d-flex justify-content-center">
                            <div class="col-md-6">
                                <h1 class="mb-5 mt-5 text-center">Falha no Login</h1>
                                    <div class="alert alert-danger" role="alert">
                                        Usuario ou senha inválidos!
                                    </div>
                                    <div class="text-center">
                                        <a href="/login.html" class="btn btn-primary">Tentar Novamente</a>
                                    </div>
                            </div>
                        </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"crossorigin="anonymous"></script>
            </html>`)
    }
}

function verificarLogin(req, resp, next) {
    if (req.session.usuarioLogado) {
        next()
    }
    else {
        resp.redirect('/login.html')
    }
}

function autenticarCadastro(req, resp) {
    const nome = req.body.nome
    const nascimento = req.body.nascimento
    const nickname = req.body.nickname

    if (nome && nascimento && nickname) {
        const usuario = { nome, nascimento, nickname }

        listaUsuarios.push(usuario)

        resp.write(`
        <html>
            <head>
                <title>Usuários cadastrados</title>
                 <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                 <meta charset="utf-8">
             </head>
                <style>
                .nav-link:hover {
                    text-decoration: underline;     
                 }
                 </style>    
                <body class="bg-light">
                    <nav class="navbar navbar-expand-lg bg-body-tertiary">
                        <div class="container-fluid">
                            <a class="navbar-brand active" href="#">Lista de Usuarios Cadastrados</a>
                            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            </div>
                        </div>
                    </nav>
                        <div class="container mt-5">
                            <div class="row justify-content-center">
                                <div >
                                    <div class="d-flex justify-content-between mb-3">
                                        <a class="btn btn-primary" href="/cadastraUsuario">Continuar Cadastrando</a>
                                        <a class="btn btn-secondary" href="/">Voltar para o Menu</a>
                                    </div>
                                    <h3 class="text-center mb-4">Lista de Usuários Cadastrados</h3>
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Nome</th>
                                                <th scope="col">Nickname</th>
                                                <th scope="col">Data de Nascimento</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                    `);
                                for (let i = 0; i < listaUsuarios.length; i++) {
                                resp.write(`
                                            <tr>
                                                <th scope="row">${i + 1}</th>
                                                <td>${listaUsuarios[i].nome}</td>
                                                <td>${listaUsuarios[i].nickname}</td>
                                                <td>${listaUsuarios[i].nascimento}</td>
                                            </tr>
                        `)
        }

        resp.write(`
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
                    </body>
                </html>
                    `)
    }
    else {
        resp.write(`<html>
                <head>
                    <title>Cadastro de Usuario</title>
    
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"><meta charset="utf-8">
                </head>
                    <style>
                        .nav-link:hover {
                        text-decoration: underline;}
                    </style>
            <body>
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand active" href="#">Cadastro de Usuarios</a>
                    <a class="nav-link active" aria-current="page" href="/">Voltar</a>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    </div>
                </div>
            </nav>
                    <div class="container d-flex justify-content-center">
                        <div class="col-md-6">
                            <h1 class="mb-5 mt-5 text-center">Cadastro de Usuário</h1>
                                <form method="POST" action="/cadastraUsuario" class="border p-4 rounded bg-primary-subtle" novalidate>
                                    <div class="mb-3">
                                        <label for="nome" class="form-label">Nome</label>
                                        <input type="text" class="form-control" id="nome" name="nome" placeholder="Nome" value="${nome}">
                     `)
        if (!nome) {
            resp.write(`
                    <div>
                        <span><p class="text-danger">Informe o nome de usuario</p></span>
                    </div>
                `)
        }
        resp.write(`</div>
                            <div class="mb-3">
                                <label for="nickname" class="form-label">Nickname/Apelido</label>
                                <input type="text" class="form-control" id="nickname" name="nickname" value="${nickname}">
                        `)
        if (!nickname) {
            resp.write(`
                    <div>
                        <span><p class="text-danger">Informe o Nickname/apelido</p></span>
                    </div>
                    `)
        }
        resp.write(`</div>
                            <div class="mb-3">
                                <label for="nascimento" class="form-label">Data de nascimento</label>
                                <input type="date" class="form-control" id="nascimento" name="nascimento"  value="${nascimento}">`)
        if (!nascimento) {
            resp.write(`
                        <div>
                            <span><p class="text-danger">Infore a Data de nascimento</p></span>
                        </div>
                        `)
        }

        resp.write(`</div>
                            <div class="text-center">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </body>
        </html>`)
    }
    resp.end()
}

function batepapo(req, resp) {
    resp.write(`
        <html>
            <head>
                <title>Bate-Papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <meta charset="utf-8">
            </head>
            <style>
                .nav-link:hover {
                text-decoration: underline;}
            </style>
                <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand active" href="#">Cadastro de Usuarios</a>
                        <a class="nav-link active" aria-current="page" href="/">Voltar</a>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        </div>
                    </div>
                </nav>
                <div class="container mt-5">
                    <div class="row">
                        <div class="col-sm-6">
                            <h3>Enviar Mensagem</h3>
                                <form method="POST" action="/enviarMensagem">
                                    <label for="usuarios">Escolha um usuário:</label>
                                    <select id="usuarios" name="usuario" class="form-select">
                                <option value="">
    `);
    for (var i = 0; i < listaUsuarios.length; i++) {
        resp.write(`<option value="${listaUsuarios[i].nickname}">${listaUsuarios[i].nickname}</option>`)
    }

    resp.write(`
                            </select>
                                <div class="mt-3">
                                    <label for="mensagem">Digite sua mensagem:</label>
                                    <input type="text" id="mensagem" name="mensagem" class="form-control" placeholder="Digite sua mensagem aqui" />
                                    <button class="btn btn-primary mt-3" type="submit">Enviar</button>
                                </div>
                            </form>
                        </div>
                        <div class="col-sm-6">
                            <h3>Chat</h3>
                            <div id="chat" style="border: 1px solid #ccc; height: 300px; overflow-y: auto; padding: 10px; background: #f9f9f9;">
    `)

    for (var i = 0; i < mensagens.length; i++) {
        resp.write(`<p><strong>${mensagens[i].usuario}:</strong> ${mensagens[i].mensagem}<br><small>Enviado: ${mensagens[i].data} às ${mensagens[i].hora}</small></p>`)
    }

    resp.write(`
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </body>
        </html>
    `)
    resp.end()

}

function autenticaMensagem(req, resp) {
    const usuario = req.body.usuario
    const mensagem = req.body.mensagem

    if (mensagem && usuario) {
        const dataHora = new Date()
        const data = dataHora.toLocaleDateString('pt-BR')
        const hora = dataHora.toLocaleTimeString('pt-BR')

        mensagens.push({ usuario, mensagem, data, hora })
        resp.redirect('/batepapo');
    }
    else {
        resp.write(`
        <html>
            <head>
                <title>Bate-Papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <meta charset="utf-8">
            </head>
            <style>
                .nav-link:hover {
                text-decoration: underline;}
            </style>
                <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand active" href="#">Cadastro de Usuarios</a>
                        <a class="nav-link active" aria-current="page" href="/">Voltar</a>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        </div>
                    </div>
                </nav>
                <div class="container mt-5">
                    <div class="row">
                        <div class="col-sm-6">
                            <h3>Enviar Mensagem</h3>
                                <form method="POST" action="/enviarMensagem">
                                    <label for="usuarios">Escolha um usuário:</label>
                                    <select id="usuarios" name="usuario" class="form-select">
                                <option value="">`)
        for (var i = 0; i < listaUsuarios.length; i++) {
            resp.write(`<option value="${listaUsuarios[i].nickname}">${listaUsuarios[i].nickname}</option>`)
        }

        resp.write(`</select>`)
        if (!usuario) {
            resp.write(`
                            <div>
                                <p class="text-danger">Selecione um usuario</p>
                            </div>
                        `)
        }

        resp.write(`    
                        <div class="mt-3">
                            <label for="mensagem">Digite sua mensagem:</label>
                            <input type="text" id="mensagem" name="mensagem" class="form-control" placeholder="Digite sua mensagem aqui"/>
                            <button class="btn btn-primary mt-3" type="submit">Enviar</button>
 `)
        if (!mensagem) {
            resp.write(`
                        <div>
                           <p class="text-danger">Você precisa escrever uma Mensagem!!</p>
                        </div>
                        `)
        }
        resp.write(`        </div>
                                </form>
                        </div>
                            <div class="col-sm-6">
                            <h3>Chat</h3>
                                <div id="chat" style="border: 1px solid #ccc; height: 300px; overflow-y: auto; padding: 10px; background: #f9f9f9;">
    `)

        for (var i = 0; i < mensagens.length; i++) {
            resp.write(`<p><strong>${mensagens[i].usuario}:</strong> ${mensagens[i].mensagem}<br><small>Enviado: ${mensagens[i].data} às ${mensagens[i].hora}</small></p>`)
        }

        resp.write(`
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </body>
        </html>
    `)
        resp.end()
    }
}

app.get('/cadastraUsuario', (req, resp) => {
    resp.redirect(`/cadastro.html`)
})

app.get('/login', (req, resp) => {
    resp.redirect('/login.html')
})

app.get('/logout', (req, resp) => {
    req.session.destroy()
    resp.redirect('/login.html')
})

app.post('/login', autenticarLogin)
app.get('/', verificarLogin, Menu)
app.get('/cadastro.html', autenticarCadastro, verificarLogin)
app.post('/cadastraUsuario', verificarLogin, autenticarCadastro)
app.get('/batePapo', verificarLogin, batepapo)
app.post('/enviarMensagem', verificarLogin, autenticaMensagem)

app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`)
})