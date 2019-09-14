const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuarios = require('../models/Usuarios');


// local strategy - Login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        //Por default passport espera un usuario y un password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                // El usuario existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    });
                } else {
                    return done(null, usuario);
                }
            } catch (error) {
                // el usuario no existe
                return done(null, false, {
                    message: 'La cuenta no existe'
                });
            }
        }
    )
);

// Serealizar al usuario
passport.serializeUser((usuaio, callback) => {
    callback(null, usuaio);
});

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;
