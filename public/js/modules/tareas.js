import axios from 'axios';
import Swal from 'sweetalert2'
import { actualizarAvance } from '../functions/avance';
const tareas = document.querySelector('.listado-pendientes')

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // Realizar request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function (respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })


        } else if (e.target.classList.contains('fa-trash')) {
            const tareHTML = e.target.parentElement.parentElement;
            const idTarea = tareHTML.dataset.tarea;

            Swal.fire({
                title: 'Deseas borrar este tarea?',
                text: "Una tarea eliminado no se puede recuperar",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.value) {
                    // Enviar peticion a axios
                    const url = `${location.origin}/tareas/${idTarea}`;

                    axios.delete(url, { params: { idTarea } })
                        .then(function (respuesta) {
                            if (respuesta.status === 200) {
                                tareHTML.parentElement.removeChild(tareHTML);
                                Swal.fire(
                                    'Eliminado!',
                                    respuesta.data,
                                    'success'
                                );
                                actualizarAvance();

                            }
                        })
                }
            }).catch(() => {
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: 'No se pudo eliminar la tarea'
                });

            })

        }
    })
}

export default tareas