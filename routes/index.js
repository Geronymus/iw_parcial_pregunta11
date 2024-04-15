const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/index'); // Importa el controlador de la agenda


router.get('/', agendaController.index);


router.post('/crearLista', agendaController.crearLista);
router.post('/editarLista', agendaController.editarLista); // Nueva ruta para editar
router.delete('/eliminarLista/:nombreLista', agendaController.eliminarLista); // Nueva ruta para eliminar










// Ruta para crear un archivo dentro de una lista existente en la agenda
router.post('/crearArchivo/:nombreLista', agendaController.crearArchivo);
router.post('/editarArchivo/:nombreLista', agendaController.editarArchivo);
router.delete('/eliminarArchivo/:nombreLista', agendaController.eliminarArchivo);





// Ruta para mostrar el contenido de una carpeta única
router.get('/mostrarArchivo/:nombreLista', agendaController.mostrarArchivo);

// Ruta para mostrar el contenido de la agenda completa
router.get('/agenda', agendaController.mostrarContenido);



module.exports = router;
