import Swal from 'sweetalert2'
export const actualizarAvance = () => {
    // Seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if (tareas.length) {
        // Seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        //Calcular el vance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        // Mostar el avance
        const porsentaje = document.querySelector('#porcentaje');

        porsentaje.style.width = avance + '%';


        if (avance === 100) {
            Swal.fire(
                'Completaste el proyecto!',
                'El proyecto se a completado con exito',
                'success'
            );
        }
    }

}