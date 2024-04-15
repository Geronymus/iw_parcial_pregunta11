const fs = require('fs-extra');
const path = require('path');


exports.index = (req, res, next) => {
    res.redirect('/agenda');
};

/* Implementacion de Carpertas */

exports.crearLista = (req, res) => {
    const nombreLista = req.body.nombreLista;

    if (!nombreLista) {
        return res.status(400).json({ error: 'Se requiere un nombre de lista' });
    }

    const agendaPath = path.join(__dirname, '..', 'data');
    const fechaCreacion = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato 'YYYY-MM-DD'
    const listaPath = path.join(agendaPath, `${nombreLista}_${fechaCreacion}`);

    if (fs.existsSync(listaPath)) {
        return res.status(400).json({ error: 'Ya existe una lista con ese nombre' });
    }

    try {
        fs.ensureDirSync(agendaPath); // Crea la carpeta "data" si no existe
        fs.mkdirSync(listaPath);

        // Redirige después de crear la lista
        res.status(201).json({ mensaje: 'Lista creada exitosamente', redirect: '/agenda' });
    } catch (error) {
        console.error('Error al crear la lista:', error);
        res.status(500).json({ error: 'Ocurrió un error al crear la lista' });
    }
};


exports.editarLista = (req, res) => {
    const nombreListaAnterior = req.body.nombreListaAnterior;
    const nuevoNombreLista = req.body.nuevoNombreLista;

    console.log("GAA" + nombreListaAnterior)
    console.log("SUII" + nuevoNombreLista)

    if (!nombreListaAnterior || !nuevoNombreLista) {
        return res.status(400).json({ error: 'Se requiere un nombre de lista anterior y un nuevo nombre' });
    }

    const agendaPath = path.join(__dirname, '..', 'data');
    const fechaCreacion = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato 'YYYY-MM-DD'
    const listaPathAnterior = path.join(agendaPath, nombreListaAnterior);

    const listaPathNuevo = path.join(agendaPath, `${nuevoNombreLista}_${fechaCreacion}`);

    if (!fs.existsSync(listaPathAnterior)) {
        return res.status(400).json({ error: 'La lista que intentas editar no existe' });
    }

    try {
        fs.renameSync(listaPathAnterior, listaPathNuevo);

        res.status(200).json({ mensaje: 'Lista editada exitosamente', redirect: '/agenda' });
    } catch (error) {
        console.error('Error al editar la lista:', error);
        res.status(500).json({ error: 'Ocurrió un error al editar la lista' });
    }
};




exports.eliminarLista = (req, res) => {
    const nombreLista = req.params.nombreLista; // Usando parámetros de ruta

    if (!nombreLista) {
        return res.status(400).json({ error: 'Se requiere un nombre de lista' });
    }

    const agendaPath = path.join(__dirname, '..', 'data');

    const listaPath = path.join(agendaPath, nombreLista);


    if (!fs.existsSync(listaPath)) {
        return res.status(400).json({ error: 'La lista que intentas eliminar no existe' });
    }

    try {
        fs.rmdirSync(listaPath, { recursive: true }); // Elimina la carpeta y su contenido

        res.status(200).json({ mensaje: 'Lista eliminada exitosamente', redirect: '/agenda' });
    } catch (error) {
        console.error('Error al eliminar la lista:', error);
        res.status(500).json({ error: 'Ocurrió un error al eliminar la lista' });
    }
};


















/*Implementacion de Archivos */


exports.crearArchivo = (req, res) => {
    const nombreLista = req.params.nombreLista; // Acceder a los parámetros en lugar del cuerpo
    const nombreArchivo = req.body.nombreArchivo;

    if (!nombreLista || !nombreArchivo) {
        return res.status(400).json({ error: 'Se requiere el nombre de la lista y el nombre del archivo' });
    }

    const agendaPath = path.join(__dirname, '..', 'data', nombreLista);

    if (!fs.existsSync(agendaPath)) {
        return res.status(400).json({ error: 'La lista especificada no existe' });
    }

    const horaActual = new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '_');
    const nombreArchivoConHora = `${horaActual}_${nombreArchivo}.txt`;

    try {
        fs.writeFileSync(path.join(agendaPath, nombreArchivoConHora), '');
        res.status(201).json({ mensaje: 'Lista creada exitosamente', redirect: `/mostrarArchivo/${nombreLista}` });

    } catch (error) {
        console.error('Error al crear el archivo:', error);
        res.status(500).json({ error: 'Ocurrió un error al crear el archivo' });
    }
};


exports.editarArchivo = (req, res) => {


    const nombreLista = req.params.nombreLista;
    const nombreArchivoAnterior = req.body.nombreArchivoAnterior;
    const nuevoNombreArchivo = req.body.nuevoNombreArchivo;

    console.log("AAA" + nombreLista )
    console.log("AAA" + nombreArchivoAnterior )
    console.log("AAA" + nuevoNombreArchivo )

    if (!nombreLista || !nombreArchivoAnterior || !nuevoNombreArchivo) {
        return res.status(400).json({ error: 'Se requiere el nombre de la lista, el nombre del archivo anterior y el nuevo nombre del archivo' });
    }

    const agendaPath = path.join(__dirname, '..', 'data', nombreLista);
    const horaActual = new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '_');

    const archivoAnteriorPath = path.join(agendaPath, nombreArchivoAnterior);


    
    const NewNuevoNombreArchivo = `${horaActual}_${nuevoNombreArchivo}.txt`;


    console.log("CCCC" + NewNuevoNombreArchivo )


    const nuevoArchivoPath = path.join(agendaPath, NewNuevoNombreArchivo);

    console.log("BBB" + nuevoArchivoPath )

    if (!fs.existsSync(archivoAnteriorPath)) {
        return res.status(400).json({ error: 'El archivo que intentas editar no existe' });
    }

    try {
        fs.renameSync(archivoAnteriorPath, nuevoArchivoPath);

        res.status(200).json({ mensaje: 'Archivo editado exitosamente', redirect: `/mostrarArchivo/${nombreLista}` });
    } catch (error) {
        console.error('Error al editar el archivo:', error);
        res.status(500).json({ error: 'Ocurrió un error al editar el archivo' });
    }
};

exports.eliminarArchivo = (req, res) => {
    const nombreLista = req.params.nombreLista;
    const nombreArchivo = req.body.nombreArchivo;

    console.log("gaaa",nombreLista )
    console.log("pepep",nombreArchivo )

    if (!nombreLista || !nombreArchivo) {
        return res.status(400).json({ error: 'Se requiere el nombre de la lista y el nombre del archivo' });
    }

    const agendaPath = path.join(__dirname, '..', 'data', nombreLista);
    const archivoPath = path.join(agendaPath, nombreArchivo);

    if (!fs.existsSync(archivoPath)) {
        return res.status(400).json({ error: 'El archivo que intentas eliminar no existe' });
    }

    try {
        fs.unlinkSync(archivoPath);

        res.status(200).json({ mensaje: 'Archivo eliminado exitosamente', redirect: `/mostrarArchivo/${nombreLista}` });
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        res.status(500).json({ error: 'Ocurrió un error al eliminar el archivo' });
    }
};









exports.mostrarArchivo = (req, res) => {
    const nombreLista = req.params.nombreLista;
    const agendaPath = path.join(__dirname, '..', 'data', nombreLista);

    try {
        const archivos = fs.readdirSync(agendaPath);
        res.render('mostrarContenido', { archivos, nombreLista }); // Pasamos nombreLista como una variable
    } catch (error) {
        console.error('Error al mostrar el contenido:', error);
        res.status(500).json({ error: 'Ocurrió un error al mostrar el contenido' });
    }
};






exports.mostrarContenido = (req, res) => {
    const agendaPath = path.join(__dirname, '..', 'data');

    try {
        const contenido = fs.readdirSync(agendaPath);
        res.render('agenda', { title: 'List Agenda', contenido });
    } catch (error) {
        console.error('Error al listar el contenido:', error);
        res.status(500).json({ error: 'Ocurrió un error al listar el contenido' });
    }
};




