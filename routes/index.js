const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/index'); // Importa el controlador de la agenda


router.get('/', agendaController.index);


// Ruta para crear una nueva lista en la agenda
router.post('/crearLista', agendaController.crearLista);

// Ruta para crear un archivo dentro de una lista existente en la agenda
router.post('/crearArchivo/:nombreLista', agendaController.crearArchivo);


// Ruta para mostrar el contenido de una carpeta única
router.get('/mostrarArchivo/:nombreLista', agendaController.mostrarArchivo);

// Ruta para mostrar el contenido de la agenda completa
router.get('/agenda', agendaController.mostrarContenido);



module.exports = router;
