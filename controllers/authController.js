const passport = require('passport');
const crypto = require('crypto');
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt-nodejs');
const Op = Sequelize.Op;
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutentificado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/iniciar-sesion');
    }
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

//Genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //Verificamos que el usuario exista
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } })

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer')
    } else {
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;

        await usuario.save();
        const resUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

        //Envia el correo con el token
        await enviarEmail.emviar({
            usuario,
            subject: 'Password Reset',
            resUrl,
            archivo: 'reestablecer-password'
        });

        //Terminar la ejecucion
        req.flash('correcto', 'Se envio un mensaje a tu correo');
        res.redirect('/iniciar-sesion')

    }
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer')
    } else {
        res.render('resetPassword', {
            nombrePagina: 'Reestablecr Contraseña'
        })
    }
}
exports.actualizarPassword = async (req, res) => {
    //Verifica el token valido y tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    //Verificamos si el usuario existe
    if (!usuario) {
        req.flash('error', 'No Valido');
        res.rediredct('/reestablecer');
    } else {
        usuario.token = null;
        usuario.expiracion = null;
        usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        await usuario.save();
        req.flash('correcto', 'Tu password se ha modificado correctamente');
        res.redirect('/iniciar-sesion');
    }
}