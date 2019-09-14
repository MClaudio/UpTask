const express = require('express');
const route = express.Router();


//importar Express Validator
const { body } = require('express-validator/check');

//Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');


module.exports = function () {
    route.get('/',
        authController.usuarioAutentificado,
        proyectosController.proyectosHome
    );

    route.get('/nuevo-proyecto',
        authController.usuarioAutentificado,
        proyectosController.formularioProyecto
    );

    route.post('/nuevo-proyecto',
        authController.usuarioAutentificado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);

    route.get('/proyectos/:url',
        authController.usuarioAutentificado,
        proyectosController.proyectoPorUrl
    );

    route.get('/proyecto/editar/:id',
        authController.usuarioAutentificado,
        proyectosController.formularioEditar
    );

    route.post('/nuevo-proyecto/:id',
        authController.usuarioAutentificado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto);

    //eliminar proyecto
    route.delete('/proyectos/:url',
        authController.usuarioAutentificado,
        proyectosController.eliminarProyecto
    );

    //Tareas
    route.post('/proyectos/:url',
        authController.usuarioAutentificado,
        tareasController.agregarTarea
    );

    //Actualizar estado de la tarea
    route.patch('/tareas/:id',
        authController.usuarioAutentificado,
        tareasController.cambiarEstadoTarea
    );

    // Eliminar tarea
    route.delete('/tareas/:id',
        authController.usuarioAutentificado,
        tareasController.eliminarTarea
    );


    // Crear nueva cuenta 
    route.get('/crear-cuenta', usuariosController.formCrearCuenta);
    route.post('/crear-cuenta', usuariosController.crearCuenta);
    route.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Iniciar Sesion
    route.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    route.post('/iniciar-sesion', authController.autenticarUsuario);

    // Cerrar Sesion
    route.get('/cerrar-sesion', authController.cerrarSesion);

    // Reestableser Pass
    route.get('/reestablecer', usuariosController.formReestableserPass);
    route.post('/reestablecer', authController.enviarToken);
    route.get('/reestablecer/:token', authController.validarToken);
    route.post('/reestablecer/:token', authController.actualizarPassword);



    return route;
}