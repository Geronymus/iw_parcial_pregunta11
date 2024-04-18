const fs = require('fs-extra');
const path = require('path');


exports.index = (req, res, next) => {
    res.redirect('/agenda');
};


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

        const contenidoArchivo = `# Nombre: ${nombreCarpeta}\n## Fecha: ${fechaTarea}\n## Hora: ${horaTarea}\n### Descripción: ${descripcionTarea}`
        fs.writeFileSync(archivoPath, contenidoArchivo);

        // Redirige después de crear la tarea
        res.status(201).json({ mensaje: 'Tarea creada exitosamente', redirect: '/agenda' });
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ error: 'Ocurrió un error al crear la tarea' });
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



exports.mostrarContenidoEditar = (req, res) => {
    const nombreLista = req.params.nombreLista;
    const carpetaPath = path.join(__dirname, '..', 'data', nombreLista);

    try {
        // Lee el contenido de la carpeta
        const archivos = fs.readdirSync(carpetaPath);

        if (archivos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron archivos en la carpeta' });
        }

        // Creamos un array para almacenar el contenido de todos los archivos
        let contenidoArray = [];

        // Iteramos sobre cada archivo encontrado
        archivos.forEach(nombreArchivo => {
            const archivoPath = path.join(carpetaPath, nombreArchivo);
            // Lee el contenido del archivo
            const contenido = fs.readFileSync(archivoPath, 'utf8');

            // Convertir la cadena de texto en un objeto con propiedades de tarea
            function parseTarea(contenido) {
                const regex = /# Nombre: (.+)\n## Fecha: (.+)\n## Hora: (\d{2}_\d{2})\n### Descripción: (.+)/;
                const match = contenido.match(regex);

                if (match) {
                    return {
                        nombre: match[1],
                        fecha: match[2],
                        hora: match[3].replace('_', ':'), // Reemplazar "_" por ":"
                        descripcion: match[4]
                    };
                } else {
                    return null; // Manejo de error si el formato no coincide
                }
            }

            // Procesar el contenido para obtener un array de tareas
            const tarea = parseTarea(contenido);
            if (tarea !== null) {
                contenidoArray.push(tarea);
            }
        });

        // Renderiza la vista con el contenido de los archivos como un array
        res.render('mostrarContenido', { title: 'List Agenda', contenido: contenidoArray });
    } catch (error) {
        console.error('Error al listar el contenido:', error);
        res.status(500).json({ error: 'Ocurrió un error al listar el contenido' });
    }
};



exports.editarLista = (req, res) => {


    const nombreListaActual = req.params.nombreLista;

    console.log("QQ", nombreListaActual)


    const tarea = {
        nombre: req.body.nombreCarpeta,
        fecha: req.body.fechaTarea,
        hora: req.body.horaTarea.replace(':', '_'),
        descripcion: req.body.descripcionTarea
    };
    const agendaPath = path.join(__dirname, '..', 'data');
    const carpetaNueva = `${tarea.nombre}_${tarea.fecha}`; // Agregamos la fecha al nombre de la carpeta
    const carpetaPath = path.join(agendaPath, carpetaNueva);


    const eliminar = path.join(agendaPath, nombreListaActual);

    try {
        // Crear la carpeta si no existe
        if (!fs.existsSync(carpetaPath)) {
            fs.mkdirSync(carpetaPath, { recursive: true });
        }

        // Crear o sobrescribir el archivo de tarea dentro de la carpeta
        const archivoNombre = `${tarea.hora}.txt`; // Usamos el nombre de la carpeta como nombre del archivo
        const archivoPath = path.join(carpetaPath, archivoNombre);

        const contenidoArchivo = `# Nombre: ${tarea.nombre}\n## Fecha: ${tarea.fecha}\n## Hora: ${tarea.hora}\n### Descripción: ${tarea.descripcion}`;


        fs.rmdirSync(eliminar, { recursive: true }); 

        fs.writeFileSync(archivoPath, contenidoArchivo);

        console.log('Editar tarea:', tarea);

        res.status(201).json({ mensaje: 'Tarea editada exitosamente', redirect: '/agenda' });
    } catch (error) {
        console.error('Error al editar la tarea:', error);
        res.status(500).json({ error: 'Ocurrió un error al editar la tarea' });
    }
};

