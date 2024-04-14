const fs = require('fs-extra');
const path = require('path');




exports.index = (req, res, next) => {
	res.redirect('/agenda');
};





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

    const horaActual = new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, ':');
    const nombreArchivoConHora = `${horaActual}_${nombreArchivo}.txt`;

    try {
        fs.writeFileSync(path.join(agendaPath, nombreArchivoConHora), '');
        res.status(201).json({ mensaje: 'Lista creada exitosamente', redirect: `/mostrarArchivo/${nombreLista}` });
        
    } catch (error) {
        console.error('Error al crear el archivo:', error);
        res.status(500).json({ error: 'Ocurrió un error al crear el archivo' });
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




