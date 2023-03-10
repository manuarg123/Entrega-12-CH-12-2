import express from 'express';
import {Connection} from "./config.js";
import dotenv from "dotenv";
import {engine} from 'express-handlebars';
import path from 'path';
import {fileURLToPath} from 'url';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import userRouter from './src/routes/user.js';

const app = express();
const connection = new Connection;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Conecto a la Base de datos y levanto la app
connection.connectMongoDB();
dotenv.config();
const server = app.listen(process.env.PORT, () => {
    console.log(`Servidor conectado correctamente al puerto ${process.env.PORT}`)
})
server.on('error', (err) => console.log(err));

//Habilito carpeta para archivos estáticos como estilos
app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'hbs');

//Define el motor de plantillas a utilizar
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    
    partialsDir: __dirname + '/src/views/partials'
}))

//Habilito la sesion para procesar el logueo
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            options: {
                userNewParser: true,
                useUnifiedTopology: true,
            }
        }),
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge: 600000} //10 min.
        
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/usuario', userRouter);


app.get('/', (req,res) => {
    res.render('templates/home', {})
})