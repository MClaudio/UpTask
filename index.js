const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/db');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//importar modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//Extraer valores de variables.env
require('dotenv').config({
    path: 'variables.env'
})

//Crear la coneccion a la base de datos
db.sync()
    .then(() => {
        //console.log('Conectado a la base de datos')
    })
    .catch((error) => {
        console.log(error)
    })



///crear una app de express
const app = express();

//Habilitar bodyParser para leer el formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Donde cargar los archivos estaticos
app.use(express.static(__dirname + "/public", {
    index: false,
    immutable: true,
    cacheControl: true,
    maxAge: "30d"
}));

//habilitar pug
app.set('view engine', 'pug');

//añadir la carpeta vistas 
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

app.use(cookieParser());

// Sesiones
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//pasar var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    next();
})



app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
})
