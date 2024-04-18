const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/index'); // Importa el controlador de la agenda


router.get('/', agendaController.index);


router.post('/crearLista', agendaController.crearLista);
router.post('/editarLista/:nombreLista', agendaController.editarLista); // Nueva ruta para editar
router.delete('/eliminarLista/:nombreLista', agendaController.eliminarLista); // Nueva ruta para eliminar

// Ruta para mostrar el contenido de la agenda completa
router.get('/agenda', agendaController.mostrarContenido);

router.get('/verArchivo/:nombreLista', agendaController.verLista);


router.get('/mostrarEditar/:nombreLista', agendaController.mostrarContenidoEditar);



module.exports = router;
