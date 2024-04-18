const fs = require('fs-extra');
const path = require('path');


exports.index = (req, res, next) => {
    res.redirect('/agenda');
};

/* Implementacion de Carpertas */

exports.crearLista = (req, res) => {
    const nombreCarpeta = req.body.nombreCarpeta;
    const fechaTarea = req.body.fechaTarea;
    let horaTarea = req.body.horaTarea.replace(':', '_'); // Reemplaza los dos puntos por guiones bajos
    const descripcionTarea = req.body.descripcionTarea;

    if (!nombreCarpeta || !fechaTarea || !horaTarea || !descripcionTarea) {
        return res.status(400).json({ error: 'Se requieren todos los campos para crear una nueva tarea' });
    }

    const agendaPath = path.join(__dirname, '..', 'data');
    const carpetaNombre = `${nombreCarpeta}_${fechaTarea}`; // Agregamos la fecha al nombre de la carpeta
    const carpetaPath = path.join(agendaPath, carpetaNombre);

    if (fs.existsSync(carpetaPath)) {
        return res.status(400).json({ error: 'Ya existe una carpeta con ese nombre' });
    }

    try {
        fs.ensureDirSync(agendaPath); // Crea la carpeta "data" si no existe
        fs.mkdirSync(carpetaPath);

        // Crear archivo de tarea dentro de la carpeta
        const archivoNombre = `${horaTarea}.txt`; // Usamos el nombre de la carpeta como nombre del archivo
        const archivoPath = path.join(carpetaPath, archivoNombre);

        const contenidoArchivo = `# ${nombreCarpeta}\n\n\nDescripción: ${descripcionTarea}`;
        fs.writeFileSync(archivoPath, contenidoArchivo);

        // Redirige después de crear la tarea
        res.status(201).json({ mensaje: 'Tarea creada exitosamente', redirect: '/agenda' });
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ error: 'Ocurrió un error al crear la tarea' });
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





exports.verLista = (req, res) => {
    const nombreLista = req.params.nombreLista;

    // Ruta a la carpeta
    const carpetaPath = path.join(__dirname, '..', 'data', nombreLista);

    try {
        // Lee el contenido de la carpeta
        const archivos = fs.readdirSync(carpetaPath);
        
        // Verifica si hay archivos en la carpeta
        if (archivos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron archivos en la carpeta' });
        }
        
        // Toma el primer archivo encontrado
        const nombreArchivo = archivos[0];
        const archivoPath = path.join(carpetaPath, nombreArchivo);

        // Lee el contenido del archivo
        const contenido = fs.readFileSync(archivoPath, 'utf8');

        // Renderiza la vista con el contenido del archivo
        res.render('verLista', { contenido });
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        res.status(500).json({ error: 'Ocurrió un error al leer el archivo' });
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




