const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask',

    })
}

exports.formIniciarSesion = (req, res) => {

    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'iniciar Sesion en UpTask',
        error

    })
}

exports.crearCuenta = async (req, res) => {
    //leer los datos de formulario 
    const { email, pass } = req.body;

    try {
        //crear usuarios 
        await Usuarios.create({
            email,
            password: pass
        })

        // Crear una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // Crear un objeto de usuario
        const usuario = {
            email
        }

        // Enviar Email
        await enviarEmail.emviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        // Redirigir al usuario
        req.flash('correcto', 'Se envio un mensaje de confirmacion a tu correo');
        res.redirect('/iniciar-sesion')
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));

        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            pass
        })
    }
}

exports.formReestableserPass = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    })
}

// Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    } else {
        usuario.activo = 1;
        await usuario.save();
        req.flash('correcto', 'Cuenta activada correctamente');
        res.redirect('/iniciar-sesion');
    }
}