import express from "express";
const router = express.Router();
import session from 'express-session';

//Obtiene la ruta login. Si estaba logueado te redirige al index y sino al login para ingresar usuario/contraseña
router.get('/login', async(req, res) => {
    if (req.session.login) {
        res.redirect('/api/usuario/login')
    } else {
        res.render('templates/login', {status: false})
    }
    
})

/**
 * Cuando ingreso un usuario y contraseña los obtiene del body, para validarlos con los que tengo cargados en .env
 */
router.post('/login', async(req, res) => {
    const {user, pass} = req.body;
    // Ugly user and pass validation below:
    if (process.env.TESTUSER === user && process.env.TESTPASS === pass) {
        req.session.login=true;
        res.redirect('/api/usuario')
    } else {
        req.session.login=false;
        res.redirect('/api/usuario/login')
    }
    
})

//Obtiene la página inicial apenas entro al localhost, validada para habilitar inicio sesion
router.get('/', async(req, res) => {
    res.render('templates/home', {status: req.session.login})
})


//Cierra la sesion eliminando los datos y redifgiendo a página de logout
router.get('/logout', async(req, res) => {
    req.session.destroy( (err) => {
        if (err) {
            res.json(err);
        } else {
            res.render('templates/logout', {status: false});
        }
    })
})

export default router;