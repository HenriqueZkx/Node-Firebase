const express = require('express')
const app = express()
const handlebars = require('express-handlebars').engine
const bodyParser = require('body-parser')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')

const serviceAccount = require('./crud-nodejs-a16d5-firebase-adminsdk-fbsvc-37344399e2.json')

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extends: false}))
app.use(bodyParser.json())

const hbs = handlebars({
    dafaultLayout: "main",
    helpers: {
        eq: (a, b) => a == b,
    },
})

app.engine('handlebars', hbs)
app.get('/', function(req, res){
    res.render("primeirapagina")
})

app.post('/cadastrar', function(req, res){
    var result = db.collection('agendamentos').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        console.log('Added document');
        res.redirect('/')
    })
 })

 app.post("/atualizar/:id", function(req, res){
    const id = req.params.id
    Post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    },
     {where:{id: id},}
    ).then(function(){
        res.redirect("/consulta")
 
    }).catch(function(erro){
        res.redirect("erro ao criar o post: " +erro)
    })
   
 })
 app.get('/consulta', function(req, res){
    Post.findAll().then(function(posts){
        res.render('consulta', {posts: posts})
        console.log(posts)
    }).catch(function(erro){
        res.send("Erro ao listar os posts: " +erro)
    })
 })

 app.get('/excluir/:id', function(req, res){
    Post.destroy({where:{id: req.params.id}}).then(function(){
        res.redirect('/consulta')
    }).catch(function(erro){
        res.send('Erro ao excluir o post: ' +erro)
    })
})

 app.get('/atualizar/:id', function(req, res){
    Post.findAll({where: {id: req.params.id}}).then(function(posts){
        res.render('atualizar', {posts: posts})
    }).catch(function(erro){
        res.send('Erro ao listar os posts: ' +erro)
    })
 })

 

app.listen(8081, function(){
    console.log('Servidor Ativo!')
})